using Application.Abstractions.Messaging;
using Domain.Enums;
using MediatR;

namespace Application.Features.Registrations.GetRegistrations;

public sealed record GetRegistrationsQuery(
    string? Status = null,
    string? Type = null,
    string? ParticipantName = null,
    string? CarMakeModel = null,
    int Page = 1,
    int PageSize = 10) : IRequest<PagedRegistrationResponse>;

public sealed record PagedRegistrationResponse(
    List<RegistrationResponse> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
