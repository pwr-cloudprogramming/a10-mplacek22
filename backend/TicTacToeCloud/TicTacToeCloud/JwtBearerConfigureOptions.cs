using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace TicTacToeCloud
{
    public class JwtBearerConfigureOptions(IConfiguration configuration)
        : IConfigureNamedOptions<JwtBearerOptions>
    {
        private const string ConfigurationSectionName = "JwtBearer";
        public void Configure(string? name, JwtBearerOptions options)
        {
            configuration.GetSection(ConfigurationSectionName).Bind(options);
        }

        public void Configure(JwtBearerOptions options)
        {
            Configure(options);
        }
    }
}
