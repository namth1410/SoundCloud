using backend.Data;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Xml;
using Formatting = Newtonsoft.Json.Formatting;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        private readonly SoundCloudContext _context;
        private readonly ISongRepository _songRepository;
        private readonly UserManager<IdentityUser> _userManager;
        public SongsController(SoundCloudContext context, ISongRepository songRepository, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _songRepository = songRepository;
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
            var identity = (ClaimsIdentity)User.Identity;

            var idUser = identity.FindFirst("idUser").Value;
            return await _songRepository.getSongLikeList(idUser);
        }

        [Authorize]
        [HttpPost("addSongLike")]
        public async Task<ActionResult> PostSongLike([FromQuery] string idSong)
        {
            /*            if (_context.SongLike == null)
                        {
                            return Problem("Entity set 'SoundCloudContext.Songs'  is null.");
                        }*/

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var identity = (ClaimsIdentity)User.Identity;
            var t = identity.FindFirst("idUser").Value;


            var claims = identity.Claims.Select(c => new { Type = c.Type, Value = c.Value });
            var usernameClaim = identity.Claims
                .FirstOrDefault(c => c.Type == "username");
            var username = identity.Claims
                .Where(c => c.Type == "idUser")
                .Select(c => c.Value);
            //var json = JsonConvert.SerializeObject(usernameClaim, Formatting.Indented);
            //var jObject = JObject.Parse(json);
            //var user = await _userManager.GetUserAsync(User);
            //var idUser = user.Id;
            var existingSongLike = await _context.SongLike
                .FirstOrDefaultAsync(sl => sl.IdUser == t && sl.IdSong == int.Parse(idSong));
            if (existingSongLike != null)
            {
                // Nếu đã tồn tại, bạn có thể xử lý tương ứng, ví dụ: trả về lỗi hoặc thông báo rằng đã tồn tại.
                return BadRequest("Dòng dữ liệu đã tồn tại.");
            }
            var song = new SongLike();
            song.IdUser = t;
            song.IdSong = int.Parse(idSong);
            _context.SongLike.Add(song);
            await _context.SaveChangesAsync();

            return Ok(username);
        }

        [Authorize]
        [HttpDelete("deleteSongLike")]
        public async Task<ActionResult> DeleteSongLike([FromQuery] string idSong)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var songLikeToDelete = _context.SongLike
                    .FirstOrDefault(sl => sl.IdUser == idUser && sl.IdSong == int.Parse(idSong));

            if (songLikeToDelete != null)
            {
                _context.SongLike.Remove(songLikeToDelete);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return NotFound("Không tìm thấy dòng dữ liệu để xóa.");
            }
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