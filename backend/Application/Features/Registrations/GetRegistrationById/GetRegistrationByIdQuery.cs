using MediatR;

namespace Application.Features.Registrations.GetRegistrationById;

public sealed record GetRegistrationByIdQuery(Guid Id) : IRequest<RegistrationResponse?>;
