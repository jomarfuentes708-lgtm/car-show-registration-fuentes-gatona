using FluentValidation;

namespace Application.Features.Registrations.UpdateRegistration;

public sealed class UpdateRegistrationCommandValidator : AbstractValidator<UpdateRegistrationCommand>
{
    public UpdateRegistrationCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.ParticipantName)
            .MaximumLength(150)
            .When(x => x.ParticipantName is not null);

        RuleFor(x => x.ContactNumber)
            .Matches(@"^09\d{9}$")
            .When(x => !string.IsNullOrWhiteSpace(x.ContactNumber))
            .WithMessage("Contact number must be in the format 09XXXXXXXXX.");

        RuleFor(x => x.Email)
            .EmailAddress()
            .MaximumLength(200)
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Address)
            .MaximumLength(300)
            .When(x => x.Address is not null);

        RuleFor(x => x.CarMakeModel)
            .MaximumLength(100)
            .When(x => x.CarMakeModel is not null);

        RuleFor(x => x.PlateNumber)
            .MaximumLength(15)
            .When(x => x.PlateNumber is not null);

        RuleFor(x => x.RegistrationFee)
            .GreaterThanOrEqualTo(0m)
            .When(x => x.RegistrationFee.HasValue);

        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0m)
            .When(x => x.AmountPaid.HasValue)
            .WithMessage("Amount paid must be zero or greater.");
    }
}
