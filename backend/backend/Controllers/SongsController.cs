using backend.Data;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        private readonly SoundCloudContext _context;
        private readonly ISongLikeRepository _songLikeRepository;
        private readonly UserManager<IdentityUser> _userManager;
        public SongsController(SoundCloudContext context, ISongLikeRepository songLikeRepository, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _songLikeRepository = songLikeRepository;
            _userManager = userManager;
        }

        // GET: api/Songs
        [Authorize]
        [HttpGet("getSongLike")]

        public async Task<ActionResult<IEnumerable<Song>>> GetSongsLike()
        {
            if (_context.SongLike == null)
            {
                return NotFound();
            }
            return await _songLikeRepository.getSongLikeList(1);
        }

        //[Authorize]
        [HttpPost("addSongLike")]
        public async Task<ActionResult> PostSongLike()
        {
            if (_context.SongLike == null)
            {
                return Problem("Entity set 'SoundCloudContext.Songs'  is null.");
            }
            var user = await _userManager.GetUserAsync(User);
            //var idUser = user.Id;
            //_context.SongLike.Add(song);
            //await _context.SaveChangesAsync();

            return Ok("a");
        }

        // GET: api/Songs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Song>>> GetSongs()
        {
            if (_context.Songs == null)
            {
                return NotFound();
            }
            return await _context.Songs.ToListAsync();
        }

        // GET: api/Songs/5
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSong(int id)
        {
            if (_context.Songs == null)
            {
                return NotFound();
            }
            var song = await _context.Songs.FindAsync(id);

            if (song == null)
            {
                return NotFound();
            }

            return Ok(song);
        }

        // PUT: api/Songs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSong(int id, Song song)
        {
            if (id != song.Id)
            {
                return BadRequest();
            }

            _context.Entry(song).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SongExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Songs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Song>> PostSong(Song song)
        {
            if (_context.Songs == null)
            {
                return Problem("Entity set 'SoundCloudContext.Songs'  is null.");
            }
            _context.Songs.Add(song);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSong", new { id = song.Id }, song);
        }

        // DELETE: api/Songs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSong(int id)
        {
            if (_context.Songs == null)
            {
                return NotFound();
            }
            var song = await _context.Songs.FindAsync(id);
            if (song == null)
            {
                return NotFound();
            }

            _context.Songs.Remove(song);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SongExists(int id)
        {
            return (_context.Songs?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}