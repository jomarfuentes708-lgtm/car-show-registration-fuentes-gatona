using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using FluentValidation;
using MediatR;

namespace Api.Features.Registrations;

public static class CreateRegistrationEndpoint
{
    public static IEndpointRouteBuilder MapCreateRegistrationEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/registrations", async (CreateRegistrationCommand command, ISender sender, CancellationToken cancellationToken) =>
        {
            try
            {
                var id = await sender.Send(command, cancellationToken);
                var created = await sender.Send(new GetRegistrationByIdQuery(id), cancellationToken);

                if (created is null)
                {
                    return Results.StatusCode(StatusCodes.Status500InternalServerError);
                }

                return Results.Created($"/api/registrations/{id}", created);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Plate number already exists", StringComparison.OrdinalIgnoreCase))
            {
                return Results.Problem(
                    title: "Conflict",
                    detail: "A registration with this plate number already exists.",
                    statusCode: StatusCodes.Status409Conflict,
                    instance: "/api/registrations");
            }
        })
        .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>()
        .WithName("CreateRegistration")
        .WithTags("Registrations");

        return app;
    }
}