using FluentValidation;

namespace Application.Features.Registrations.CreateRegistration;

public class CreateRegistrationCommandValidator : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationCommandValidator()
    {
        RuleFor(x => x.ParticipantName)
            .NotEmpty().WithMessage("Participant name is required.")
            .MaximumLength(100).WithMessage("Participant name must not exceed 100 characters.");

        RuleFor(x => x.ContactNumber)
            .NotEmpty().WithMessage("Contact number is required.")
            .Matches(@"^[0-9+\-\s()]*$").WithMessage("Invalid contact number format.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required.");

        RuleFor(x => x.CarMakeModel)
            .NotEmpty().WithMessage("Car make and model is required.");

        RuleFor(x => x.PlateNumber)
            .NotEmpty().WithMessage("Plate number is required.");

        RuleFor(x => x.RegistrationType)
            .IsInEnum().WithMessage("Invalid registration type.");

        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0).WithMessage("Amount paid cannot be negative.");
    }
}