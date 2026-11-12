using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.CreateRegistration;

public sealed class CreateRegistrationCommandHandler : ICommandHandler<CreateRegistrationCommand, Guid>
{
    private readonly IAppDbContext _dbContext;

    public CreateRegistrationCommandHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(CreateRegistrationCommand request, CancellationToken cancellationToken)
    {
        var normalizedPlateNumber = request.PlateNumber.Trim();

        var plateExists = await _dbContext.Registrations
            .AsNoTracking()
            .AnyAsync(x => x.PlateNumber == normalizedPlateNumber, cancellationToken);

        if (plateExists)
        {
            throw new InvalidOperationException("Plate number already exists.");
        }

        var registrationFee = request.RegistrationType switch
        {
            RegistrationType.Exhibitor => 1500m,
            RegistrationType.Competitor => 2500m,
            RegistrationType.VIP => 5000m,
            _ => 0m
        };

        var lastRegistrationNumber = await _dbContext.Registrations
            .AsNoTracking()
            .Where(x => x.RegistrationNumber.StartsWith("CS27-"))
            .Select(x => x.RegistrationNumber)
            .OrderByDescending(x => x)
            .FirstOrDefaultAsync(cancellationToken);

        var nextSerial = 1;
        if (!string.IsNullOrWhiteSpace(lastRegistrationNumber))
        {
            var suffix = lastRegistrationNumber.Substring("CS27-".Length);
            if (int.TryParse(suffix, out var currentValue))
            {
                nextSerial = currentValue + 1;
            }
        }

        var registration = new Registration
        {
            ParticipantName = request.ParticipantName,
            ContactNumber = request.ContactNumber,
            Email = request.Email,
            Address = request.Address,
            CarMakeModel = request.CarMakeModel,
            PlateNumber = normalizedPlateNumber,
            RegistrationType = request.RegistrationType,
            RegistrationFee = registrationFee,
            AmountPaid = request.AmountPaid,
            Status = Status.Pending,
            RegistrationDate = DateTime.UtcNow,
            RegistrationNumber = $"CS27-{nextSerial:0000}"
        };

        await _dbContext.Registrations.AddAsync(registration, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return registration.Id;
    }
}