namespace Application.Features.Registrations.DashboardStats;

public sealed record RegistrationStatsResponse(
    int TotalRegistrations,
    int Confirmed,
    int CheckedIn,
    int Pending,
    int Cancelled,
    decimal TotalFees,
    decimal TotalPayments,
    decimal UncollectedPayments);
