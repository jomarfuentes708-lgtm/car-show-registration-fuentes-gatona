using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Features.Registrations.UpdateRegistration;

public sealed record UpdateRegistrationCommand(
    Guid Id,
    string? ParticipantName,
    string? ContactNumber,
    string? Email,
    string? Address,
    string? CarMakeModel,
    string? PlateNumber,
    RegistrationType? RegistrationType,
    Status? Status,
    decimal? RegistrationFee,
    decimal? AmountPaid) : ICommand<bool>;
