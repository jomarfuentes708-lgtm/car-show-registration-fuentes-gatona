using Application.Features.Registrations.GetRegistrations;
using FluentValidation;
using MediatR;

namespace Api.Features.Registrations;

public static class GetRegistrationsEndpoint
{
    public static IEndpointRouteBuilder MapGetRegistrationsEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/registrations", async (
            string? status,
            string? type,
            string? participantName,
            string? carMakeModel,
            int page,
            int pageSize,
            ISender sender,
            IValidator<GetRegistrationsQuery> validator,
            CancellationToken cancellationToken) =>
        {
            var query = new GetRegistrationsQuery(status, type, participantName, carMakeModel, page == 0 ? 1 : page, pageSize == 0 ? 10 : pageSize);
            var validation = await validator.ValidateAsync(query, cancellationToken);

            if (!validation.IsValid)
            {
                return Results.ValidationProblem(validation.ToDictionary());
            }

            var result = await sender.Send(query, cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetRegistrations")
        .WithTags("Registrations");

        return app;
    }
}
