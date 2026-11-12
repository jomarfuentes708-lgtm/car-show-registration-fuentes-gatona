using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.DeleteRegistration;

public sealed class DeleteRegistrationCommandHandler : ICommandHandler<DeleteRegistrationCommand, bool>
{
    private readonly IAppDbContext _dbContext;

    public DeleteRegistrationCommandHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteRegistrationCommand command, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Registrations
            .SingleOrDefaultAsync(x => x.Id == command.Id, cancellationToken);

        if (entity is null)
        {
            return false;
        }

        _dbContext.Registrations.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}
