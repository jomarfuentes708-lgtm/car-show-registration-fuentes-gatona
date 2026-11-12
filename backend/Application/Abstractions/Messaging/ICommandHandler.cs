using MediatR;

namespace Application.Abstractions.Messaging;

public interface ICommandHandler<TCommand, TResponse> : IRequestHandler<TCommand, TResponse>
    where TCommand : class, ICommand<TResponse>
{
}
