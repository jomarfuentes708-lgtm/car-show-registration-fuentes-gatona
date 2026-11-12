using Application.Abstractions.Messaging;

namespace Application.Features.Registrations.DeleteRegistration;

public sealed record DeleteRegistrationCommand(Guid Id) : ICommand<bool>;
