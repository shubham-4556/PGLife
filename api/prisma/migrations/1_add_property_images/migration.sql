-- Adds `property_images`, which replaces the PHP app's per-request `glob()` of
-- web/public/img/properties/<id>/. Storing the paths makes the API
-- self-describing and makes image order explicit.
--
-- Also tightens the three rating columns to NOT NULL. The original
-- setup_database.sql declared them as `decimal(2,1) DEFAULT '0.0'`, which is
-- implicitly nullable. All 10 existing rows already carry a value, so this is a
-- no-op for current data and it stops future rows storing NULL.
--
-- Deliberately does NOT rename the pre-existing foreign keys. Prisma's MySQL
-- diff wants to rewrite `properties_ibfk_1` to `properties_city_id_fkey` and so
-- on, because a Prisma datamodel cannot express a foreign key constraint name.
-- That is cosmetic churn against a live database, so it is left out; the
-- referential actions already agree (NO ACTION on both sides).

-- AlterTable
ALTER TABLE `properties`
    MODIFY `rating_clean` DECIMAL(2, 1) NOT NULL DEFAULT 0,
    MODIFY `rating_food` DECIMAL(2, 1) NOT NULL DEFAULT 0,
    MODIFY `rating_safety` DECIMAL(2, 1) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `property_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `src` VARCHAR(500) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    INDEX `property_id`(`property_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `properties_name_idx` ON `properties`(`name`);

-- AddForeignKey
ALTER TABLE `property_images` ADD CONSTRAINT `property_images_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
