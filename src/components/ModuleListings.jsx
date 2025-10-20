"use client";

// This components handles the restaurant listings page
// It receives data from src/app/page.jsx, such as the initial restaurants and search params from the URL

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderSkulls from "@/src/components/Skulls.jsx";
import { getModuleSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const ModuleItem = ({ module }) => (
  <li key={module.id}>
    <Link href={`/module/${module.id}`}>
      <ActiveModule module={module} />
    </Link>
  </li>
);

const ActiveModule = ({ module }) => (
  <div>
    <ImageCover photo={module.photo} name={module.name} />
    <ModuleDetails module={module} />
  </div>
);

const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    <img src={photo} alt={name} />
  </div>
);

const ModuleDetails = ({ module }) => (
  <div className="module__details">
    <h2>{module.name}</h2>
    <ModuleRating module={module} />
    <ModuleMetadata module={module} />
  </div>
);

const ModuleRating = ({ module }) => (
  <div className="module__rating">
    <ul>{renderSkulls(module.avgRating)}</ul>
    <span>({module.numRatings})</span>
  </div>
);

const ModuleMetadata = ({ module }) => (
  <div className="module__meta">
    <p>
      Genre: {module.genre} | Players: {module.players}
    </p>
    <p>Difficulty: {"💀".repeat(module.difficulty)}</p>
  </div>
);

export default function ModuleListings({
  initialModules,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    players: searchParams.players || "",
    genre: searchParams.genre || "",
    difficulty: searchParams.difficulty || "",
    sort: searchParams.sort || "",
  };

  const [modules, setModules] = useState(initialModules);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getModuleSnapshot((data) => {
      setModules(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="modules">
        {modules.map((module) => (
          <ModuleItem key={module.id} module={module} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}
