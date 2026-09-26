import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { GENDERS, type Gender } from "../src/lib/gender.js";

const prisma = new PrismaClient();

const here = dirname(fileURLToPath(import.meta.url));
const imageManifest: Record<string, string[]> = JSON.parse(
  readFileSync(join(here, "property-images.json"), "utf8"),
);

/**
 * Idempotent by design.
 *
 * This database already existed before the Node.js rewrite, so the seed must not
 * be allowed to wipe it: it upserts on natural keys (city name, property name
 * within a city, amenity name, testimonial author within a property) instead of
 * deleting first. Running it against the populated database is therefore a
 * no-op, and running it against an empty one produces a complete dataset.
 *
 * Ids are pinned explicitly because they have to keep matching the
 * img/properties/<id>/ folders the PHP app used to build image paths.
 */
const CITIES = [
  { id: 1, name: "Delhi" },
  { id: 2, name: "Mumbai" },
  { id: 3, name: "Bengaluru" },
  { id: 4, name: "Hyderabad" },
  { id: 5, name: "Chennai" },
];

const AMENITIES = [
  { id: 1, name: "WiFi", type: "Building", icon: "wifi" },
  { id: 2, name: "Parking", type: "Building", icon: "parking" },
  { id: 3, name: "Power Backup", type: "Building", icon: "powerbackup" },
  { id: 4, name: "Lift", type: "Building", icon: "lift" },
  { id: 5, name: "CCTV", type: "Building", icon: "cctv" },
  { id: 6, name: "Fire Extinguisher", type: "Building", icon: "fireext" },
  { id: 7, name: "Dining Area", type: "Common Area", icon: "dining" },
  { id: 8, name: "TV", type: "Common Area", icon: "tv" },
  { id: 9, name: "Washing Machine", type: "Common Area", icon: "washingmachine" },
  { id: 10, name: "RO Water", type: "Common Area", icon: "rowater" },
  { id: 11, name: "AC", type: "Bedroom", icon: "ac" },
  { id: 12, name: "Bed", type: "Bedroom", icon: "bed" },
  { id: 13, name: "Geyser", type: "Washroom", icon: "geyser" },
];

const PROPERTIES: Array<{
  id: number;
  cityId: number;
  name: string;
  address: string;
  gender: Gender;
  rent: number;
  ratingClean: string;
  ratingFood: string;
  ratingSafety: string;
  description: string;
}> = [
  { id: 1, cityId: 1, name: "Cozy PG for Boys", address: "123 Main Street, Connaught Place", gender: "male", rent: 8000, ratingClean: "4.5", ratingFood: "4.0", ratingSafety: "4.5", description: "A comfortable PG with all modern amenities" },
  { id: 2, cityId: 1, name: "Girls PG near Metro", address: "456 Park Avenue, Karol Bagh", gender: "female", rent: 9000, ratingClean: "4.0", ratingFood: "4.5", ratingSafety: "4.0", description: "Safe and secure PG for girls with metro connectivity" },
  { id: 3, cityId: 2, name: "Premium PG Andheri", address: "789 Link Road, Andheri West", gender: "unisex", rent: 12000, ratingClean: "4.5", ratingFood: "4.5", ratingSafety: "4.5", description: "Luxury PG with premium facilities" },
  { id: 4, cityId: 2, name: "Budget PG Dadar", address: "321 Station Road, Dadar", gender: "male", rent: 7000, ratingClean: "3.5", ratingFood: "3.0", ratingSafety: "3.5", description: "Affordable PG near Dadar station" },
  { id: 5, cityId: 3, name: "Tech Park PG", address: "555 IT Park Road, Whitefield", gender: "unisex", rent: 15000, ratingClean: "4.5", ratingFood: "4.0", ratingSafety: "4.5", description: "PG near tech parks with great amenities" },
  { id: 6, cityId: 3, name: "Student PG Koramangala", address: "777 80 Feet Road, Koramangala", gender: "female", rent: 10000, ratingClean: "4.0", ratingFood: "4.0", ratingSafety: "4.0", description: "Popular PG among students" },
  { id: 7, cityId: 4, name: "Hitech City PG", address: "999 Cyberabad Road, Hitech City", gender: "male", rent: 11000, ratingClean: "4.0", ratingFood: "4.5", ratingSafety: "4.0", description: "Modern PG for working professionals" },
  { id: 8, cityId: 4, name: "Gachibowli PG", address: "111 Financial District, Gachibowli", gender: "unisex", rent: 13000, ratingClean: "4.5", ratingFood: "4.0", ratingSafety: "4.5", description: "Premium PG in financial district" },
  { id: 9, cityId: 5, name: "Anna Nagar PG", address: "222 2nd Avenue, Anna Nagar", gender: "female", rent: 8500, ratingClean: "4.0", ratingFood: "3.5", ratingSafety: "4.0", description: "Comfortable PG in prime location" },
  { id: 10, cityId: 5, name: "T Nagar PG", address: "333 Usman Road, T Nagar", gender: "male", rent: 7500, ratingClean: "3.5", ratingFood: "3.5", ratingSafety: "3.5", description: "Budget friendly PG near shopping area" },
];

// Original rule set, derived from the amenity links that were already in the
// database: every property gets the Building amenities, and each successive
// tier switches on at a rent threshold. Note the space in "Common Area" — that
// is the value actually stored in `amenities.type`.
//
//   Building     rent >= 0     all 10 properties
//   Common Area  rent >= 8500  7 properties
//   Bedroom      rent >= 10000 5 properties
//   Washroom     rent >= 11000 4 properties
//                                    = 60 + 28 + 10 + 4 = 102 links
const AMENITY_RULES: Array<{ type: string; minRent: number }> = [
  { type: "Building", minRent: 0 },
  { type: "Common Area", minRent: 8500 },
  { type: "Bedroom", minRent: 10000 },
  { type: "Washroom", minRent: 11000 },
];

const TESTIMONIALS = [
  { propertyId: 1, userName: "Rahul Sharma", content: "Great place to stay! Very clean and food is good." },
  { propertyId: 1, userName: "Amit Kumar", content: "Nice PG with helpful staff." },
  { propertyId: 2, userName: "Priya Singh", content: "Very safe and secure. Metro is nearby." },
  { propertyId: 2, userName: "Neha Gupta", content: "Good food and clean rooms." },
  { propertyId: 3, userName: "Arjun Patel", content: "Premium facilities, worth the price." },
  { propertyId: 3, userName: "Kavya Reddy", content: "Best PG I have stayed in Bangalore." },
  { propertyId: 4, userName: "Vikram Singh", content: "Budget friendly and decent." },
  { propertyId: 5, userName: "Sanjay Kumar", content: "Excellent location near tech parks." },
  { propertyId: 5, userName: "Ravi Teja", content: "Great amenities and clean environment." },
];

/**
 * MySQL has no sequences to reset: the AUTO_INCREMENT counter lives inside each
 * table. Advancing it past the highest seeded id stops the next application
 * INSERT from colliding with the explicitly-assigned seed ids.
 *
 * The value has to be a literal — MySQL does not accept a subquery in
 * `ALTER TABLE ... AUTO_INCREMENT = ...` — so read the maximum first. The table
 * names are hardcoded literals above, never user input.
 */
async function advanceAutoIncrement() {
  const tables = ["cities", "properties", "amenities", "property_images", "testimonials"];

  for (const table of tables) {
    const rows = await prisma.$queryRawUnsafe<Array<{ next: number | bigint }>>(
      `SELECT COALESCE(MAX(id), 0) + 1 AS next FROM \`${table}\``,
    );
    const next = Number(rows[0]?.next ?? 1);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = ${next}`);
  }
}

async function main() {
  console.log(`Upserting ${CITIES.length} cities...`);
  for (const city of CITIES) {
    await prisma.city.upsert({
      where: { id: city.id },
      create: city,
      update: { name: city.name },
    });
  }

  console.log(`Upserting ${AMENITIES.length} amenities...`);
  for (const amenity of AMENITIES) {
    await prisma.amenity.upsert({
      where: { id: amenity.id },
      create: amenity,
      update: { name: amenity.name, type: amenity.type, icon: amenity.icon },
    });
  }

  console.log(`Upserting ${PROPERTIES.length} properties...`);
  for (const property of PROPERTIES) {
    await prisma.property.upsert({
      where: { id: property.id },
      create: property,
      update: {
        cityId: property.cityId,
        name: property.name,
        address: property.address,
        gender: property.gender,
        rent: property.rent,
        ratingClean: property.ratingClean,
        ratingFood: property.ratingFood,
        ratingSafety: property.ratingSafety,
        description: property.description,
      },
    });
  }

  console.log("Linking amenities to properties...");
  for (const property of PROPERTIES) {
    const amenityIds = AMENITIES.filter((amenity) =>
      AMENITY_RULES.some(
        (rule) => rule.type === amenity.type && property.rent >= rule.minRent,
      ),
    ).map((amenity) => amenity.id);

    // `skipDuplicates` keeps this safe to re-run: existing links are left alone
    // rather than raising a duplicate-key error.
    await prisma.propertyAmenity.createMany({
      data: amenityIds.map((amenityId) => ({ propertyId: property.id, amenityId })),
      skipDuplicates: true,
    });
  }

  console.log("Seeding property images...");
  let imageCount = 0;
  for (const property of PROPERTIES) {
    const images = imageManifest[String(property.id)] ?? [];
    if (images.length === 0) continue;

    const existing = await prisma.propertyImage.findMany({
      where: { propertyId: property.id },
      select: { id: true },
    });
    if (existing.length > 0) continue;

    await prisma.propertyImage.createMany({
      data: images.map((src, position) => ({ propertyId: property.id, src, position })),
    });
    imageCount += images.length;
  }

  console.log(`Upserting ${TESTIMONIALS.length} testimonials...`);
  for (const testimonial of TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({
      where: { propertyId: testimonial.propertyId, userName: testimonial.userName },
      select: { id: true },
    });
    if (existing) continue;
    await prisma.testimonial.create({ data: testimonial });
  }

  await advanceAutoIncrement();

  const [cities, properties, amenities, images, testimonials] = await Promise.all([
    prisma.city.count(),
    prisma.property.count(),
    prisma.amenity.count(),
    prisma.propertyImage.count(),
    prisma.testimonial.count(),
  ]);

  console.log(
    `Done. Database now holds: ${cities} cities, ${properties} properties, ` +
      `${amenities} amenities, ${images} images, ${testimonials} testimonials.`,
  );
  console.log(`(${imageCount} image rows inserted on this run.)`);
}

// Guard against a typo in the seed data reaching a VARCHAR gender column.
for (const property of PROPERTIES) {
  if (!(GENDERS as readonly string[]).includes(property.gender)) {
    throw new Error(`Invalid gender "${property.gender}" for property ${property.id}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
