using MediatR;

namespace Application.Features.Registrations.DashboardStats;

public sealed record GetRegistrationStatsQuery : IRequest<RegistrationStatsResponse>;
