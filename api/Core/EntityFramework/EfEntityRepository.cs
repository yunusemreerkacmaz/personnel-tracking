using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Core.EntityFramework
{
    public class EfEntityRepository<TEntity, TContext> : IEntityRepository<TEntity>
         where TEntity : class, IEntity, new()
         where TContext : DbContext, new()
    {
        private TContext _context;
        public EfEntityRepository(TContext context)
        {
            _context = context;
        }
        public async Task<TEntity> AddAsync(TEntity entity)
        {

            await _context.Set<TEntity>().AddAsync(entity);
            bool isAdded = _context.Entry(entity).State == EntityState.Added;
            if (isAdded)
            {
                await _context.SaveChangesAsync();
                return entity;
            }
            else
            {
                return null;
            }
        }
        public async Task<bool> AddRangeAsync(List<TEntity> list)
        {
            await _context.Set<TEntity>().AddRangeAsync(list);
            bool allAdded = list.All(entity => _context.Entry(entity).State == EntityState.Added);
            if (allAdded)
            {
                await _context.SaveChangesAsync();
            }
            return allAdded;
        }
        public async Task<bool> DeleteAsync(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
            bool isDeleted = _context.Entry(entity).State == EntityState.Deleted;
            if (isDeleted)
            {
                await _context.SaveChangesAsync();
            }
            return isDeleted;
        }
        public IQueryable<TEntity> GetAllQueryAble(Expression<Func<TEntity, bool>>? filter = null)
        {
            return filter == null ?
        _context.Set<TEntity>():
        _context.Set<TEntity>().Where(filter);
        }
        public async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? filter = null)
        {

            return filter == null ?
                   await _context.Set<TEntity>().ToListAsync() :
                   await _context.Set<TEntity>().Where(filter).ToListAsync();

        }
        public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> filter)
        {
            return await _context.Set<TEntity>().SingleOrDefaultAsync(filter);
        }
        public async Task<bool> UpdateAsync(TEntity entity)
        {
            _context.Set<TEntity>().Update(entity);
            var isUpdated = _context.Entry(entity).State == EntityState.Modified;
            if (isUpdated)
            {
                await _context.SaveChangesAsync();
            }
            return isUpdated;
        }
    }
}
