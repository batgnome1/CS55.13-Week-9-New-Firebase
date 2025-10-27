

export default function AboutPage() {
  return (
    <main>
      <h1 className="about"> GNOMERCY</h1>
      <h2 className="about">A Tabletop Role-playing Game System</h2>
      <article className="aboutarticle">
        <p>Gnomercy is a generic TTRPG system - a foundation of rules and mechanics without setting, 
            genre or lore. It is a highly customizable, flexible system designed to accommodate modding / homebrewing. 
        </p>
        <br></br>
        <p>
            The lore, worldbuilding, genre and story for Gnomercy are provided via Modules - self contained campaigns
            tailored for a set number of players to roleplay specific scenarios. 
        </p>
        <div className="aboutimg"><img src='/gnomercy-logo.svg' alt='gnomercylogo' /></div>
        </article>
    </main>
  );
}