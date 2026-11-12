using Application.Abstractions.Data;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.DashboardStats;

public sealed class GetRegistrationStatsQueryHandler : IRequestHandler<GetRegistrationStatsQuery, RegistrationStatsResponse>
{
    private readonly IAppDbContext _dbContext;

    public GetRegistrationStatsQueryHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RegistrationStatsResponse> Handle(GetRegistrationStatsQuery request, CancellationToken cancellationToken)
    {
        var registrations = _dbContext.Registrations.AsNoTracking();

        var totalRegistrations = await registrations.CountAsync(cancellationToken);
        var confirmed = await registrations.CountAsync(x => x.Status == Status.Confirmed, cancellationToken);
        var checkedIn = await registrations.CountAsync(x => x.Status == Status.CheckedIn, cancellationToken);
        var pending = await registrations.CountAsync(x => x.Status == Status.Pending, cancellationToken);
        var cancelled = await registrations.CountAsync(x => x.Status == Status.Cancelled, cancellationToken);

        var activeRegistrations = registrations.Where(x => x.Status != Status.Cancelled);
        var totalFees = await activeRegistrations.SumAsync(x => x.RegistrationFee, cancellationToken);
        var totalPayments = await activeRegistrations.SumAsync(x => x.AmountPaid, cancellationToken);
        var uncollectedPayments = await activeRegistrations
            .Where(x => x.AmountPaid < x.RegistrationFee)
            .SumAsync(x => x.RegistrationFee - x.AmountPaid, cancellationToken);

        return new RegistrationStatsResponse(
            totalRegistrations,
            confirmed,
            checkedIn,
            pending,
            cancelled,
            totalFees,
            totalPayments,
            uncollectedPayments);
    }
}
