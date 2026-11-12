using System.Text.Json.Serialization;
using Application.Abstractions.Data;
using Api.Features.Registrations;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

builder.Services.AddValidatorsFromAssembly(typeof(IAppDbContext).Assembly);
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(IAppDbContext).Assembly));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Vertical Slice API Template by Elvin Manuel R. Luces, MIT";
        document.Info.Description = "A simple API demonstrating Vertical Slice Architecture";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

    if (!dbContext.Registrations.Any())
    {
        dbContext.Registrations.AddRange(BuildSeedRegistrations());
        dbContext.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors("AllowFrontend");

app.MapGet("/", () => "Welcome to the Vertical Slice API! Go to /scalar/v1 for API documentation.");

app.MapCreateRegistrationEndpoint();
app.MapGetRegistrationsEndpoint();
app.MapGetRegistrationByIdEndpoint();
app.MapUpdateRegistrationEndpoint();
app.MapDeleteRegistrationEndpoint();
app.MapGetRegistrationStatsEndpoint();

app.Run();

static List<Registration> BuildSeedRegistrations()
{
    var registrations = new List<Registration>();
    var seedData = new[]
    {
        ("Ana Santos", "09123456789", "ana.santos@example.com", "Cebu City", "Toyota Fortuner", "ABC-1234", RegistrationType.Exhibitor, Status.Confirmed, 1500m, 1500m),
        ("Ben Dela Cruz", "09987654321", "ben.delacruz@example.com", "Davao City", "Honda Civic", "DEF-5678", RegistrationType.Competitor, Status.Pending, 2500m, 500m),
        ("Carla Reyes", "09111222333", "carla.reyes@example.com", "Manila", "Ford Ranger", "GHI-9012", RegistrationType.VIP, Status.CheckedIn, 5000m, 5000m),
        ("Daniel Lim", "09333444555", "daniel.lim@example.com", "Bacolod", "BMW 320i", "JKL-3456", RegistrationType.Competitor, Status.Pending, 2500m, 0m),
        ("Ella Mendoza", "09777888999", "ella.mendoza@example.com", "Iloilo", "Mazda 3", "MNO-7890", RegistrationType.Exhibitor, Status.Confirmed, 1500m, 1500m),
        ("Felix Tan", "09123456788", "felix.tan@example.com", "Cagayan De Oro", "Kia Sportage", "PQR-2468", RegistrationType.Competitor, Status.Cancelled, 2500m, 0m),
        ("Grace Villanueva", "09234567890", "grace.villanueva@example.com", "Tagaytay", "Mercedes-Benz C200", "STU-1357", RegistrationType.VIP, Status.Confirmed, 5000m, 5000m),
        ("Henry Co", "09345678901", "henry.co@example.com", "Baguio", "Nissan Navara", "VWX-2468", RegistrationType.Exhibitor, Status.CheckedIn, 1500m, 1500m),
        ("Isabelle Ramos", "09456789012", "isabelle.ramos@example.com", "General Santos", "Subaru WRX", "XYZ-9876", RegistrationType.Competitor, Status.Confirmed, 2500m, 2500m),
        ("Jason Cruz", "09567890123", "jason.cruz@example.com", "Quezon City", "Volkswagen Golf", "AAA-1111", RegistrationType.Exhibitor, Status.Pending, 1500m, 500m),
        ("Kimberly Uy", "09678901234", "kimberly.uy@example.com", "Batangas", "Hyundai Tucson", "BBB-2222", RegistrationType.VIP, Status.Pending, 5000m, 2000m),
        ("Luis Garcia", "09789012345", "luis.garcia@example.com", "Cebu", "Chevrolet Camaro", "CCC-3333", RegistrationType.Competitor, Status.Confirmed, 2500m, 2500m),
        ("Mia Navarro", "09890123456", "mia.navarro@example.com", "Metro Manila", "Peugeot 408", "DDD-4444", RegistrationType.Exhibitor, Status.Confirmed, 1500m, 1500m),
        ("Noel Rivera", "09901234567", "noel.rivera@example.com", "Pangasinan", "Audi A4", "EEE-5555", RegistrationType.Competitor, Status.CheckedIn, 2500m, 2500m),
        ("Olivia Torres", "09012345678", "olivia.torres@example.com", "Laguna", "Porsche 911", "FFF-6666", RegistrationType.VIP, Status.Confirmed, 5000m, 5000m),
        ("Paul Dizon", "09134567890", "paul.dizon@example.com", "Tacloban", "Mitsubishi Mirage", "GGG-7777", RegistrationType.Exhibitor, Status.CheckedIn, 1500m, 1500m),
        ("Queenie Gonzales", "09245678901", "queenie.gonzales@example.com", "Legazpi", "Toyota Prius", "HHH-8888", RegistrationType.Competitor, Status.Pending, 2500m, 1000m),
        ("Rafael Delfin", "09356789012", "rafael.delfin@example.com", "Zamboanga", "Lexus RX", "III-9999", RegistrationType.VIP, Status.Cancelled, 5000m, 0m),
        ("Sofia Mercado", "09467890123", "sofia.mercado@example.com", "Iligan", "BMW X5", "JJJ-1010", RegistrationType.Exhibitor, Status.Confirmed, 1500m, 1500m),
        ("Tomas Fernandez", "09578901234", "tomas.fernandez@example.com", "Dumaguete", "Ferrari Roma", "KKK-1111", RegistrationType.VIP, Status.CheckedIn, 5000m, 5000m),
        ("Ursula Aquino", "09689012345", "ursula.aquino@example.com", "Lipa", "Nissan GT-R", "LLL-1212", RegistrationType.Competitor, Status.Confirmed, 2500m, 2500m),
        ("Victor De Leon", "09790123456", "victor.deleon@example.com", "Bacolod", "Volvo XC60", "MMM-1313", RegistrationType.Exhibitor, Status.Pending, 1500m, 0m),
        ("Wendy Santos", "09801234567", "wendy.santos@example.com", "San Fernando", "Tesla Model 3", "NNN-1414", RegistrationType.Competitor, Status.Confirmed, 2500m, 2500m),
        ("Xander Perez", "09912345678", "xander.perez@example.com", "Calamba", "Kia EV6", "OOO-1515", RegistrationType.VIP, Status.Pending, 5000m, 2500m),
        ("Yvette Arciaga", "09023456789", "yvette.arciaga@example.com", "Puerto Princesa", "Renault Clio", "PPP-1616", RegistrationType.Exhibitor, Status.Confirmed, 1500m, 1500m),
        ("Zachary Yu", "09145678901", "zachary.yu@example.com", "Naga", "Mini Cooper", "QQQ-1717", RegistrationType.Competitor, Status.CheckedIn, 2500m, 2500m)
    };

    for (var index = 0; index < seedData.Length; index++)
    {
        var (participantName, contactNumber, email, address, carMakeModel, plateNumber, registrationType, status, registrationFee, amountPaid) = seedData[index];
        registrations.Add(new Registration
        {
            ParticipantName = participantName,
            ContactNumber = contactNumber,
            Email = email,
            Address = address,
            CarMakeModel = carMakeModel,
            PlateNumber = plateNumber,
            RegistrationType = registrationType,
            Status = status,
            RegistrationFee = registrationFee,
            AmountPaid = amountPaid,
            RegistrationDate = DateTime.UtcNow.AddDays(-(index + 1)),
            RegistrationNumber = $"CS27-{(index + 1):0000}"
        });
    }

    return registrations;
}
