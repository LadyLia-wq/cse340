const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://renderdb_z81z_user:0AAkcTMNdBb1XE1J9ePImOnbYDuCiOZK@dpg-d72og8fdiees738vfmm0-a.singapore-postgres.render.com/renderdb_z81z",
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    console.log("Connecting...");
    await client.connect();

    console.log("Running query...");
    const res = await client.query("SELECT NOW()");
    
    console.log("✅ Success:", res.rows[0]);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.end();
    console.log("Connection closed");
  }
})();