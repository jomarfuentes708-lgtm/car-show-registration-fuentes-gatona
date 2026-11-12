using Application.Features.Registrations.DashboardStats;
using MediatR;

namespace Api.Features.Registrations;

public static class GetRegistrationStatsEndpoint
{
    public static IEndpointRouteBuilder MapGetRegistrationStatsEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/registrations/summary", async (ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new GetRegistrationStatsQuery(), cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetRegistrationSummary")
        .WithTags("Registrations");

        return app;
    }
}
