using Application.Features.Registrations.UpdateRegistration;
using MediatR;

namespace Api.Features.Registrations;

public static class UpdateRegistrationEndpoint
{
    public static IEndpointRouteBuilder MapUpdateRegistrationEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPut("/api/registrations/{id:guid}", async (Guid id, UpdateRegistrationCommand command, ISender sender, CancellationToken cancellationToken) =>
        {
            if (command.Id == Guid.Empty)
            {
                return Results.BadRequest();
            }

            var result = await sender.Send(new UpdateRegistrationCommand(
                id,
                command.ParticipantName,
                command.ContactNumber,
                command.Email,
                command.Address,
                command.CarMakeModel,
                command.PlateNumber,
                command.RegistrationType,
                command.Status,
                command.RegistrationFee,
                command.AmountPaid), cancellationToken);

            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateRegistration")
        .WithTags("Registrations");

        return app;
    }
}
