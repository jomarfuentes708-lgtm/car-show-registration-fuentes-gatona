using Application.Features.Registrations.GetRegistrationById;
using MediatR;

namespace Api.Features.Registrations;

public static class GetRegistrationByIdEndpoint
{
    public static IEndpointRouteBuilder MapGetRegistrationByIdEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/registrations/{id:guid}", async (Guid id, ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new GetRegistrationByIdQuery(id), cancellationToken);

            return result is null
                ? Results.NotFound()
                : Results.Ok(result);
        })
        .WithName("GetRegistrationById")
        .WithTags("Registrations");

        return app;
    }
}
