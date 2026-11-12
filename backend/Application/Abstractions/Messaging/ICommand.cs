using MediatR;

namespace Application.Abstractions.Messaging;

public interface ICommand<TResponse> : IRequest<TResponse>;
