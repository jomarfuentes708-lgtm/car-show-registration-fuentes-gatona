using Application.Abstractions.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.GetRegistrationById;

public sealed class GetRegistrationByIdQueryHandler : IRequestHandler<GetRegistrationByIdQuery, RegistrationResponse?>
{
    private readonly IAppDbContext _dbContext;

    public GetRegistrationByIdQueryHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RegistrationResponse?> Handle(GetRegistrationByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Registrations
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity is null)
        {
            return null;
        }

        return new RegistrationResponse(
            entity.Id,
            entity.RegistrationNumber,
            entity.RegistrationDate,
            entity.ParticipantName,
            entity.ContactNumber,
            entity.Email,
            entity.Address,
            entity.CarMakeModel,
            entity.PlateNumber,
            entity.RegistrationType.ToString(),
            entity.Status.ToString(),
            entity.RegistrationFee,
            entity.AmountPaid,
            entity.PaymentStatus);
    }
}
