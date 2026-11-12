using FluentValidation;

namespace Api.Features.Registrations;

public sealed class ValidationFilter<T> : IEndpointFilter
{
    private readonly IValidator<T>? _validator;

    public ValidationFilter(IValidator<T>? validator)
    {
        _validator = validator;
    }

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        if (_validator is null)
        {
            return await next(context);
        }

        var argument = context.Arguments.FirstOrDefault(a => a is T);
        if (argument is null)
        {
            return await next(context);
        }

        var validationResult = await _validator.ValidateAsync((T)argument, context.HttpContext.RequestAborted);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(x => x.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(x => x.ErrorMessage).ToArray());

            return Results.ValidationProblem(errors);
        }

        return await next(context);
    }
}
