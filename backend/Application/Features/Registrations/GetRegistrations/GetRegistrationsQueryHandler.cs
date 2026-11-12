using Application.Abstractions.Data;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.GetRegistrations;

public sealed class GetRegistrationsQueryHandler : IRequestHandler<GetRegistrationsQuery, PagedRegistrationResponse>
{
    private readonly IAppDbContext _dbContext;

    public GetRegistrationsQueryHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedRegistrationResponse> Handle(GetRegistrationsQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize switch
        {
            < 1 => 10,
            > 50 => 50,
            _ => request.PageSize
        };

        var query = _dbContext.Registrations
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<Status>(request.Status, true, out var status))
        {
            query = query.Where(x => x.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<RegistrationType>(request.Type, true, out var registrationType))
        {
            query = query.Where(x => x.RegistrationType == registrationType);
        }

        if (!string.IsNullOrWhiteSpace(request.ParticipantName))
        {
            query = query.Where(x => x.ParticipantName.Contains(request.ParticipantName));
        }

        if (!string.IsNullOrWhiteSpace(request.CarMakeModel))
        {
            query = query.Where(x => x.CarMakeModel.Contains(request.CarMakeModel));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var items = await query
            .OrderByDescending(x => x.RegistrationDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new RegistrationResponse(
                x.Id,
                x.RegistrationNumber,
                x.RegistrationDate,
                x.ParticipantName,
                x.ContactNumber,
                x.Email,
                x.Address,
                x.CarMakeModel,
                x.PlateNumber,
                x.RegistrationType.ToString(),
                x.Status.ToString(),
                x.RegistrationFee,
                x.AmountPaid,
                x.PaymentStatus))
            .ToListAsync(cancellationToken);

        return new PagedRegistrationResponse(items, page, pageSize, totalCount, totalPages == 0 ? 0 : totalPages);
    }
}
