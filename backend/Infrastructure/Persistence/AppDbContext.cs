namespace Infrastructure.Persistence;

using Application.Abstractions.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Registration> Registrations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.HasIndex(x => x.PlateNumber)
                .IsUnique();

            entity.HasIndex(x => x.RegistrationNumber)
                .IsUnique();

            entity.Property(x => x.RegistrationNumber)
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(x => x.PlateNumber)
                .HasMaxLength(15)
                .IsRequired();

            entity.Property(x => x.ParticipantName)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(x => x.ContactNumber)
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(x => x.Email)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.Address)
                .HasMaxLength(300)
                .IsRequired();

            entity.Property(x => x.CarMakeModel)
                .HasMaxLength(100)
                .IsRequired();
        });
    }
}
