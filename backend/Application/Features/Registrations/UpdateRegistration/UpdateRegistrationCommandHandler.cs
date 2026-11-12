using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.UpdateRegistration;

public sealed class UpdateRegistrationCommandHandler : ICommandHandler<UpdateRegistrationCommand, bool>
{
    private readonly IAppDbContext _dbContext;

    public UpdateRegistrationCommandHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(UpdateRegistrationCommand command, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Registrations
            .SingleOrDefaultAsync(x => x.Id == command.Id, cancellationToken);

        if (entity is null)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(command.ParticipantName))
            entity.ParticipantName = command.ParticipantName;

        if (!string.IsNullOrWhiteSpace(command.ContactNumber))
            entity.ContactNumber = command.ContactNumber;

        if (!string.IsNullOrWhiteSpace(command.Email))
            entity.Email = command.Email;

        if (!string.IsNullOrWhiteSpace(command.Address))
            entity.Address = command.Address;

        if (!string.IsNullOrWhiteSpace(command.CarMakeModel))
            entity.CarMakeModel = command.CarMakeModel;

        if (!string.IsNullOrWhiteSpace(command.PlateNumber))
            entity.PlateNumber = command.PlateNumber;

        if (command.RegistrationType.HasValue)
            entity.RegistrationType = command.RegistrationType.Value;

        if (command.Status.HasValue)
            entity.Status = command.Status.Value;

        if (command.RegistrationFee.HasValue)
            entity.RegistrationFee = command.RegistrationFee.Value;

        if (command.AmountPaid.HasValue)
            entity.AmountPaid = command.AmountPaid.Value;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}
