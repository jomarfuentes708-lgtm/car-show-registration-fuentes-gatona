using Application.Features.Registrations.DeleteRegistration;
using MediatR;

namespace Api.Features.Registrations;

public static class DeleteRegistrationEndpoint
{
    public static IEndpointRouteBuilder MapDeleteRegistrationEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/registrations/{id:guid}", async (Guid id, ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new DeleteRegistrationCommand(id), cancellationToken);
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteRegistration")
        .WithTags("Registrations");

        return app;
    }
}
