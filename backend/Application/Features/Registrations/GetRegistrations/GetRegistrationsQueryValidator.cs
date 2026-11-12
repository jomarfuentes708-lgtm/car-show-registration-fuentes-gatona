using FluentValidation;

namespace Application.Features.Registrations.GetRegistrations;

public sealed class GetRegistrationsQueryValidator : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1)
            .LessThanOrEqualTo(50)
            .WithMessage("Page size must be between 1 and 50.");

        RuleFor(x => x.Type)
            .Must(type => string.IsNullOrWhiteSpace(type) || Enum.TryParse<Domain.Enums.RegistrationType>(type, true, out _))
            .When(x => !string.IsNullOrWhiteSpace(x.Type))
            .WithMessage("Type must be Exhibitor, Competitor, or VIP.");

        RuleFor(x => x.Status)
            .Must(status => string.IsNullOrWhiteSpace(status) || Enum.TryParse<Domain.Enums.Status>(status, true, out _))
            .When(x => !string.IsNullOrWhiteSpace(x.Status))
            .WithMessage("Status must be Pending, Confirmed, CheckedIn, or Cancelled.");
    }
}
