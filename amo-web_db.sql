-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 28, 2026 at 08:15 AM
-- Server version: 11.4.10-MariaDB-ubu2204
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amo-web_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` int(11) NOT NULL,
  `brand_name` varchar(100) NOT NULL,
  `brand_image` varchar(255) DEFAULT NULL,
  `main_type` enum('Surface','Furnishing','Other') NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `brand_url` varchar(255) DEFAULT 'https://amo.co.th',
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `brand_name`, `brand_image`, `main_type`, `type`, `brand_url`, `active`) VALUES
(1, 'ATLAS CONCORDE', '/uploads/admin/095a3c64-b57c-48f6-9b5d-ecdcb5facaeb.png', 'Surface', 'Tile', 'https://www.atlasconcorde.com/en/', 1),
(2, 'ATLAS PLAN', '/uploads/admin/a5a6ac09-cf98-4809-a247-ebd405b60cb2.png', 'Surface', 'Tile', 'https://www.atlasplan.com/en/', 1),
(3, 'ENERGIEKER', '/Brandlogo/ENERGIEKER.svg', 'Surface', 'Tile', 'https://www.energieker.it/en/', 1),
(4, 'MIRAGE', '/Brandlogo/MIRAGE.svg', 'Surface', 'Tile', 'https://www.mirage.it/it/en', 1),
(5, 'CAESAR', '/Brandlogo/CAESAR.svg', 'Surface', 'Tile', 'https://www.caesar.it/en/', 1),
(6, 'SETTECENTO', '/Brandlogo/SETTECENTO.svg', 'Surface', 'Tile', 'https://www.settecento.com/en/', 1),
(7, 'COTTO D’ESTE', '/uploads/admin/97609025-badb-4c03-bcf2-8ea74e2f36fc.png', 'Surface', 'Tile', 'https://www.cottodeste.com/', 1),
(9, 'SANT’AGOSTINO', '/Brandlogo/SANT’AGOSTINO.svg', 'Surface', 'Tile', 'https://www.ceramicasantagostino.it/en/', 1),
(10, 'KEOPE', '/Brandlogo/KEOPE.svg', 'Surface', 'Tile', 'https://www.keope.com/en', 1),
(11, 'FAST', '/Brandlogo/FAST.svg', 'Furnishing', 'Outdoor', 'https://www.fastspa.com/en/', 1),
(12, 'VARASCHIN', '/Brandlogo/VARASCHIN.svg', 'Furnishing', 'Outdoor', 'https://varaschin.it/en/', 1),
(13, 'PLUST+', '/Brandlogo/PLUST+.png', 'Furnishing', 'Outdoor', 'https://www.plust.it/en/', 1),
(14, 'MYYOUR', '/Brandlogo/MYYOUR.jpg', 'Furnishing', 'Outdoor', 'https://myyour.eu/en/', 1),
(15, 'SANTA LUCIA', '/uploads/admin/2760b6b4-1d84-4145-818c-e7c2f1389639.png', 'Furnishing', 'All functions', 'https://santaluciamobili.it/en/', 1),
(19, 'ILLULIAN', '/Brandlogo/ILLULIAN.png', 'Furnishing', 'Rug', 'https://www.illulian.com/', 1),
(21, 'GAN RUGS', '/Brandlogo/GAN_RUGS.png', 'Furnishing', 'Rug', 'https://www.gan-rugs.com/en/', 1),
(22, 'NANIMARQUINA', '/uploads/admin/6141b179-9983-40fa-8bd8-8f4688be645a.png', 'Furnishing', 'Rug', 'https://nanimarquina.com/en', 1),
(23, 'ADRIANI ROSSI', '/Brandlogo/ADRIANI_ROSSI.png', 'Furnishing', 'Complimentary', 'https://www.adrianierossi.com/', 1),
(24, 'LITOKOL', '/Brandlogo/LITOKOL.jpg', 'Other', 'Setting Materials', 'https://www.litokol.it/en', 1),
(25, 'ETERNO IVICA', '/Brandlogo/ETERNO_IVICA.jpg', 'Other', 'Raised Floor', 'https://www.eternoivica.com/en', 1),
(26, 'FOGLIE D’ORO', '/Brandlogo/FOGLIE_D’ORO.png', 'Other', 'Engineered Wood', 'https://fogliedoroparquet.com/en/', 1),
(27, 'MUTINA', '/Brandlogo/MUTINA.svg', 'Surface', 'Mosaic', 'https://www.mutina.it/en/', 1),
(28, 'WINCKLEMANS', '/uploads/admin/bbb69a00-2580-4cf1-ad8e-690d9e545121.png', 'Surface', 'Mosaic', 'https://www.winckelmans.com/en/home/', 1),
(29, 'VIDREPUR', '/Brandlogo/VIDREPUR.svg', 'Surface', 'Mosaic', 'https://vidrepur.com/', 1),
(30, 'SICIS', '/Brandlogo/SICIS.png', 'Surface', 'Mosaic', 'https://www.sicis.com/GLOBAL/en/', 1),
(31, 'LENID', '/Brandlogo/LENID.png', 'Surface', 'Decor Tiles', 'http://www.lenid.it/en/', 1),
(33, 'VISTOSI', '/Brandlogo/VISTORI.svg', 'Furnishing', 'Lighting', 'https://vistosi.it/?lang=en', 1),
(34, 'PANZERI', '/Brandlogo/PANZERI.jpg', 'Furnishing', 'Lighting', 'https://panzeri.it/en/', 1),
(35, 'MARSET', '/Brandlogo/MARSET.svg', 'Furnishing', 'Lighting', 'https://www.marset.com/en/', 1),
(36, 'CATTELANI SMITH', '/Brandlogo/CATTELANI_SMITH.png', 'Furnishing', 'Lighting', 'https://www.catellanismith.com/en/', 1),
(37, 'SERIP', '/Brandlogo/SERIP.png', 'Furnishing', 'Lighting', 'https://seripdesign.com/en/home', 1),
(38, 'EUROLUCE', '/Brandlogo/EUROLUCE.png', 'Furnishing', 'Lighting', 'https://eurolucelampadari.it/en/', 1),
(39, 'ANTONANGELI', '/Brandlogo/ANTONANGELI.png', 'Furnishing', 'Lighting', 'https://antonangelilighting.com/', 1),
(40, 'NEMO LIGHTING', '/Brandlogo/NEMO_LIGHTING.svg', 'Furnishing', 'Lighting', 'https://www.nemolighting.com/usa/en/', 1),
(41, 'FONTANA ARTE', '/Brandlogo/FONTANA_ARTE.png', 'Furnishing', 'Lighting', 'https://www.fontanaarte.com/en/', 1),
(42, 'ARTE BROTTO', '/Brandlogo/ARTE_BROTTO.png', 'Furnishing', 'Dining and Bedroom', 'https://www.artebrotto.it/en/', 1),
(43, 'DITRE ITALIA', '/uploads/admin/af988a95-5a0d-4e1d-833f-a3b0f374f6a0.png', 'Furnishing', 'All functions', 'https://www.ditreitalia.com/en/', 1),
(44, 'SABA ITALIA', '/uploads/admin/a3f81615-2a41-48d1-91c5-1094fb420168.jpeg', 'Furnishing', 'Living', 'https://sabaitalia.com/en', 1),
(45, 'POTOCCO', '/Brandlogo/POTOCCO.png', 'Furnishing', 'All functions', 'https://potocco.it/en/', 1),
(46, 'NICOLINE', '/Brandlogo/NICOLINE.png', 'Furnishing', 'Living', 'https://www.nicoline.it/en', 1),
(47, 'KRISTALIA', '/Brandlogo/KRISTALIA.svg', 'Furnishing', 'Seatings', 'https://www.kristalia.it/en/', 1),
(48, 'FAMA', '/Brandlogo/FAMA.png', 'Furnishing', 'Seatings', 'https://famasofas.com/inicio-en', 1),
(49, 'CAPO D\'OPERA', '/Brandlogo/CAPO_D’OPERA.svg', 'Furnishing', 'Cabinets', 'https://capodopera.it/en/', 1),
(50, 'TACCHINI', '/Brandlogo/TACCHINI.svg', 'Furnishing', 'All functions', 'https://www.tacchini.it/en/', 1),
(51, 'LA MANUFACTURE', '/Brandlogo/LA_MANUFACTURE.svg', 'Furnishing', 'Complimentary', 'https://lamanufacture-paris.fr/en/', 1),
(52, 'GIORGIO CASA', '/Brandlogo/GIORGIO_CASA.png', 'Furnishing', 'All functions', 'https://giorgiocasa.it/en/', 1),
(54, 'INCLASS', '/Brandlogo/INCLASS.svg', 'Furnishing', 'Seatings', 'https://inclass.es/', 1),
(56, 'HURTADO', '/uploads/admin/88ae0f90-7ee4-4be0-a469-44c88e1e799b.jpg', 'Furnishing', 'All functions', 'https://www.hurtado.eu/en', 1),
(57, 'ALCAROL', '/Brandlogo/ALCAROL.jpg', 'Furnishing', 'Complimentary', 'https://www.alcarol.com/', 1),
(59, 'BONTEMPI', '/uploads/admin/7361e1d0-4a22-4d5e-a312-2c9bd38ce2c7.png', 'Furnishing', 'All functions', 'https://www.bontempi.it/en/', 1),
(64, 'FLEXTEAM', '/uploads/admin/8050ecce-a2f3-4f4c-92c5-d00f61e7fdb2.png', 'Furnishing', 'Living', 'https://www.flexteam.it/en/', 1),
(65, 'TWILS', '/uploads/admin/cccdd1d0-149a-44a3-a591-74a4348ec54b.jpg', 'Furnishing', 'Living', 'https://www.twils.it/en/', 1);

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `collection_id` int(11) NOT NULL,
  `collection_name` varchar(100) NOT NULL,
  `material_type` varchar(100) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `type` enum('Surface','Furniture','Other') NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `relate_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`collection_id`, `collection_name`, `material_type`, `brand_id`, `type`, `status`, `description`, `image`, `link`, `relate_link`) VALUES
(4, 'Marvel T', 'Halo White', 1, 'Surface', 0, 'Travertine', '/uploads/admin/1ca8d317-9573-40d9-a91c-440a732dc8ec.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/marvel-t/halo-white?selectedTab=matte', 'www.google.com'),
(5, 'Lims', 'Ivory', 1, 'Surface', 0, 'Stone', '/uploads/admin/33d0b302-5557-4b27-a9bc-1673bb10f6a9.jpeg', '', 'https://www.atlasconcorde.com/en/ac-collection/boost-icor/bone?selectedTab=matte-sensitech'),
(6, 'Marvel ', 'Calacatta Extra', 1, 'Surface', 0, 'Marble ', '/uploads/admin/99d34346-9d52-49ca-9550-a0fa12573ef2.jpg', 'https://www.atlasconcorde.com/en/ac-collection/marvel/calacatta-extra?selectedTab=matte', ''),
(7, 'Elysian', 'EY09 Gold Catalan', 4, 'Surface', 1, 'Stone', '/uploads/admin/c26c3768-b3cd-45b5-b10d-5a79698eb4af.jpg', 'https://mirage.it/it/en/products/elysian-ey09', ''),
(8, 'Marvel Stone', 'Nero Marquina', 1, 'Surface', 0, 'Marble', '/uploads/admin/114a3ded-708d-4e4e-a4ba-2d4625ccb3c7.jpg', '', ''),
(9, 'Brave', 'Gypsum', 1, 'Surface', 1, 'Stone', '/uploads/admin/0efe1fb5-9129-4da4-9fc4-57f9d0b533f3.jpg', 'https://www.atlasconcorde.com/en/ac-collection/brave/gypsum?selectedTab=grip-sensitech', ''),
(10, 'Brave', 'Pearl', 1, 'Surface', 1, 'Stone', '/uploads/admin/f1602840-c303-4ebb-b884-f1b8de0a0d7d.jpg', 'https://www.atlasconcorde.com/en/ac-collection/brave/pearl?selectedTab=matte-sensitech', ''),
(11, 'Brave', 'Grey', 1, 'Surface', 1, 'Stone', '/uploads/admin/db1372f5-24e0-4b8d-941c-8009e130ede8.jpg', 'https://www.atlasconcorde.com/en/ac-collection/brave/grey?selectedTab=matte-sensitech', ''),
(12, 'Marvel Gala', 'Amazzonite', 1, 'Surface', 1, 'Marble', '/uploads/admin/a85abfdd-654d-4487-981a-ca65a5596409.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/marvel-gala/amazzonite?selectedTab=polished', ''),
(13, 'Marvel T ', 'Romano Silver ', 1, 'Surface', 1, 'Stone ', '/uploads/admin/9f70dba5-8b8a-48db-8324-dd1b31308ea7.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/marvel-t/romano-silver/matte-sensitech-60x120-9-hcda', ''),
(14, 'Marvel Gala', 'Crystal White', 1, 'Surface', 1, 'Marble', '/uploads/admin/e096927d-af38-4c72-bf8a-6abaf99f994b.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/marvel-gala/crystal-white?selectedTab=polished', ''),
(15, 'Boost Icor ', 'Bone ', 1, 'Surface', 1, 'Stone ', '/uploads/admin/b18a7e7b-915d-47db-8188-bdcab7b6037e.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/boost-icor/bone/matte-sensitech-75x150-9-ayar', ''),
(16, 'Marvel ', 'Grey Stone', 1, 'Surface', 0, 'Mable', '/uploads/admin/f639aa91-5d38-4add-81cc-24216931a21f.jpg', '', 'https://mirage.it/it/en/products/jewels-jolie-jl06'),
(17, 'Marvel Travertine ', 'Sand Vein ', 1, 'Surface', 1, 'Stone ', '/uploads/admin/304659a5-659b-4af3-b12d-affb7eef94c4.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/marvel-travertine/sand-vein/matte-sensitech-60x120-9-afua', ''),
(18, 'Boost Pro', 'Ivory', 1, 'Surface', 1, 'Cement/Resin/Clay', '/uploads/admin/9784cc69-fa84-4034-a165-c8151b8bdcc2.jpg', 'https://www.atlasconcorde.com/en/ac-collection/boost-pro/ivory?selectedTab=matte', ''),
(19, 'Exence ', 'Almond ', 1, 'Surface', 1, 'Wood ', '/uploads/admin/2b3b5101-1eb5-465a-9719-b1d881862a9f.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/exence/almond/matte-sensitech-20x120-9-ao48', ''),
(20, 'Ubik ', 'Grey ', 10, 'Surface', 1, 'Stone ', '/uploads/admin/f98f589b-d2a9-4b85-a1a2-fd8f48528043.png', 'https://www.keope.com/en/collections/slate-effect-porcelain-tiles-ubik', ''),
(21, 'Via Appia', 'Vein Cut Ivory', 9, 'Surface', 1, 'Travertine', '/uploads/admin/b9c63366-bc32-45b6-b495-436a810524d4.jpg', 'https://www.ceramicasantagostino.it/en/collections/via-appia/appia-vein-cut-ivory', ''),
(22, 'Exence ', 'Porcelain ', 1, 'Surface', 1, 'Wook ', '/uploads/admin/624fc15c-8757-43b7-9cda-a7d6bc71d74d.jpeg', 'https://www.atlasconcorde.com/en/ac-collection/exence/almond/matte-sensitech-20x120-9-ao48', ''),
(23, 'Blaze ', 'Porcelain ', 1, 'Surface', 0, 'Metal ', '/uploads/admin/79f097ae-c81e-4ae9-b815-5d1ad3effc75.jpg', '', 'https://www.energieker.it/en/collections/flatiron/'),
(24, 'Motley ', 'Porcelain ', 1, 'Surface', 1, 'Stone ', '/uploads/admin/5484dada-f090-4017-8eaf-1aa551721726.jpg', 'https://mirage.it/it/en/products/motley-mt06', ''),
(25, 'Proxi ', 'Porcelain ', 6, 'Surface', 1, 'Stone ', '/uploads/admin/8492e94c-0b99-4ec8-8931-2d8952db25b1.webp', 'https://www.settecento.com/en/serie.php?cod=49', '');

-- --------------------------------------------------------

--
-- Table structure for table `home_sliders`
--

CREATE TABLE `home_sliders` (
  `slider_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `home_sliders`
--

INSERT INTO `home_sliders` (`slider_id`, `image_url`, `display_order`, `created_at`) VALUES
(2, '/uploads/admin/29e015bf-82e5-4fab-bb72-5a17cc4ee321.jpg', 4, '2025-11-01 14:08:39'),
(3, '/uploads/admin/33348c05-a3a4-43e1-a707-7674a4127124.jpg', 2, '2025-11-01 14:08:39'),
(6, '/uploads/admin/b1ce2622-58be-473f-bcc5-e3d742ae46e4.jpg', 3, '2025-11-02 05:06:32'),
(10, '/uploads/admin/36f25554-949b-408c-962b-6827b484b590.jpg', 5, '2026-02-06 17:15:41'),
(12, '/uploads/admin/11664ad6-2ec6-4287-b9e8-3964082cad58.jpg', 1, '2026-02-07 03:44:06');

-- --------------------------------------------------------

--
-- Table structure for table `product_focus`
--

CREATE TABLE `product_focus` (
  `focus_id` int(11) NOT NULL,
  `collection_name` varchar(100) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `made_in` varchar(50) DEFAULT NULL,
  `type` enum('Furnishing','Surface') NOT NULL,
  `link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_focus`
--

INSERT INTO `product_focus` (`focus_id`, `collection_name`, `brand_id`, `description`, `made_in`, `type`, `link`) VALUES
(5, 'Isla', 15, 'Stock : Islands with movable backrests', 'Italy', 'Furnishing', 'https://www.ditreitalia.com/en/products/sofas-en/isla/'),
(6, 'Gravity', 64, 'Stock : Sofa with movable roll cushion', 'Italy', 'Furnishing', 'https://www.flexteam.it/en/gravity-sofa/'),
(7, 'Windstone', 9, 'Stone > \nStock : Grey : 60x120 Matt R10 and Grip R11', 'Italy', 'Surface', 'https://www.ceramicasantagostino.it/en/collections/windstone'),
(8, 'Re-Concrete', 4, 'Stone Concrete > \nStock : Rice and Artic : 120x120 Matt R10', 'Italy', 'Surface', 'https://mirage.it/na/en/products/collections/reconcrete'),
(9, 'Boost Stone', 1, 'Stone > \nStock : Ivory : 60x120 Matt R10 and Grip R11', 'Italy', 'Surface', 'https://www.atlasconcorde.com/en/ac-collection/boost-stone'),
(10, 'Nyra', 1, 'Marble Stone > \nStock : Star and Mist : 60x120 Matt R210', 'Italy', 'Surface', 'https://www.atlasconcorde.com/en/ac-collection/nyra'),
(11, 'Marvel Travertine', 1, 'Travertine > \nStock : White, Sand, Pearl : 60x120 Matt R10 / 120x240x0.9 Matt R10 / 120x278x0.6 Matt R9 / 160x320x0.6 Matt R9 / 162x324x1.2 Matt R9', 'Italy', 'Surface', 'https://www.atlasconcorde.com/en/ac-collection/marvel-travertine'),
(12, 'Boost Icor', 1, 'Stone > \nStock : Bone : 60x120 Matt R10 and Grip R11 / 120x278x0.6 Matt R9', 'Italy', 'Surface', 'https://www.atlasconcorde.com/en/ac-collection/boost-icor/bone?selectedTab=matte'),
(13, 'Kumo', 65, 'Stock : Extra-large Loveseat and footstool ', 'Italy', 'Furnishing', 'https://www.twils.it/en/sofas/kumo-sofa/'),
(14, 'My Taos', 44, 'Stock : Sofa with right-arm-facing with Island', 'Italy', 'Furnishing', 'https://sabaitalia.com/en/products/my-taos-p1721'),
(15, 'Marvel T', 1, 'Travertine > \nStock : Halo White 60x120 Matt R10 / Halo Sand 60x120 Matt R10 & Grip R11 / Navona White 60x120 Matt R10 / Halo White 120x278x0.6 Matt R9', 'Italy', 'Surface', 'https://www.atlasconcorde.com/en/ac-collection/marvel-t');

-- --------------------------------------------------------

--
-- Table structure for table `product_focus_images`
--

CREATE TABLE `product_focus_images` (
  `image_id` int(11) NOT NULL,
  `focus_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_focus_images`
--

INSERT INTO `product_focus_images` (`image_id`, `focus_id`, `image_url`, `display_order`) VALUES
(33, 12, '/uploads/admin/c8b4ecc7-783f-4dc0-854d-c05e600572b4.jpeg', 0),
(34, 10, '/uploads/admin/5a55cd04-0192-41ca-93f1-b8336df829f4.jpg', 0),
(35, 11, '/uploads/admin/39ec3ff6-67e3-4c8d-8b0d-66eaa5d06a9a.jpg', 0),
(36, 9, '/uploads/admin/30124bcb-10b3-4faa-bb5f-4bfc1cdeac41.jpg', 0),
(37, 8, '/uploads/admin/c9eb9e28-ae12-4dff-a7d9-60efa15093fb.jpg', 0),
(38, 7, '/uploads/admin/8f8910cb-881f-423c-858e-edceacba91b2.webp', 0),
(40, 5, '/uploads/admin/ae9f2241-3b9f-4eef-ab5d-f4bf1bcf94c8.jpg', 0),
(41, 6, '/uploads/admin/bdd39bef-da1f-45ec-956c-3927368c754c.jpg', 0),
(42, 13, '/uploads/admin/3fd57f11-fdb7-440c-97f2-8f9510911398.webp', 0),
(43, 14, '/uploads/admin/2209eb2c-1807-423e-8b4a-2adb65895d2a.jpg', 0),
(44, 15, '/uploads/admin/52e95e6e-1124-4d6a-a310-8ab3bab71d61.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_furnish_items`
--

CREATE TABLE `product_furnish_items` (
  `item_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_furnish_items`
--

INSERT INTO `product_furnish_items` (`item_id`, `image`, `link`) VALUES
(1, '/uploads/furnishing/04cda656-ad9f-40c3-97e6-7c13b2958a3c.webp', 'https://seripdesign.com/en/products/lighting-bijout?tipo=2&col=2'),
(2, '/uploads/furnishing/40582be4-ffbc-45d2-9930-de6d0600e3e0.webp', 'https://www.twils.it/en/sofas/kamari-divano/'),
(3, '/uploads/furnishing/cdafa822-a063-4bb8-9bb8-214d08d9657f.webp', 'https://sabaitalia.com/en/products/pixel-p24'),
(4, '/uploads/furnishing/c1ce3d88-4d78-49ec-afdd-a3aa2c2d26dc.jpg', 'https://www.bontempi.it/en/kimono-5415/'),
(5, '/uploads/furnishing/b4d8f7f3-027c-44a0-8a97-340043a327a0.jpg', 'https://www.artebrotto.it/en/vero-4/');

-- --------------------------------------------------------

--
-- Table structure for table `product_main`
--

CREATE TABLE `product_main` (
  `id` int(11) NOT NULL,
  `collection_name` varchar(100) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_main`
--

INSERT INTO `product_main` (`id`, `collection_name`, `brand_id`, `link`) VALUES
(4, 'Marvel T', 1, 'https://www.atlasconcorde.com/en/ac-collection/marvel-t');

-- --------------------------------------------------------

--
-- Table structure for table `product_main_images`
--

CREATE TABLE `product_main_images` (
  `image_id` int(11) NOT NULL,
  `product_main_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_main_images`
--

INSERT INTO `product_main_images` (`image_id`, `product_main_id`, `image_url`) VALUES
(16, 4, '/uploads/admin/26f54c71-d6d5-48a8-be76-945253313e64.jpg'),
(17, 4, '/uploads/admin/e59e462c-7c74-44e2-9233-ac67979f6a42.jpg'),
(18, 4, '/uploads/admin/76982af9-057b-4b6b-8c06-fbd95152414e.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product_surface_items`
--

CREATE TABLE `product_surface_items` (
  `item_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_surface_items`
--

INSERT INTO `product_surface_items` (`item_id`, `image`, `link`) VALUES
(1, '/uploads/surface/b101f0b4-658d-4f93-acd5-6fa674566646.jpg', 'https://www.ceramicasantagostino.it/en/collections/bergstone'),
(2, '/uploads/surface/3fd6f305-9385-4214-9f03-ec47b38c80b3.jpg', 'https://www.atlasconcorde.com/en/ac-collection/marvel-diva'),
(3, '/uploads/surface/55db744b-b18c-48b4-b358-db3191283909.jpg', 'https://www.cottodeste.com/products/collection/solaris'),
(5, '/uploads/surface/3948b19e-5f31-4ac6-b0f5-27ec0388eb1e.jpg', 'https://www.atlasconcorde.com/en/ac-collection/boost-vision'),
(6, '/uploads/surface/495d748d-0226-4e7b-90d7-e9e6423d7df8.jpg', 'https://mirage.it/de/en/products/collections/noriven');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `project_name` varchar(100) NOT NULL,
  `data_update` date NOT NULL,
  `project_category` enum('Residential','Commercial') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `data_update`, `project_category`) VALUES
(1, 'Lifestyle Space', '2025-11-01', 'Residential'),
(2, 'Amo Pavilion 2025', '2025-10-25', 'Commercial'),
(3, 'Modern Loft Project', '2025-10-10', 'Residential'),
(6, 'JM House', '2025-10-09', 'Commercial'),
(7, 'Residence_1', '2020-12-22', 'Residential'),
(8, 'PROJECT CHW', '2026-01-10', 'Residential'),
(9, 'CENTRAL DUSIT PARK L6', '2026-09-29', 'Commercial'),
(10, 'THE RHYTM PAVILION', '2026-10-01', 'Residential'),
(11, 'Dusit Park, Bangkok', '2026-02-07', 'Commercial'),
(12, 'RamaIII Residence', '2025-03-21', 'Residential'),
(13, 'Sathupradit Residence', '2023-08-14', 'Residential'),
(14, 'Niche Mono Sukhumvit-Bearing', '2020-10-05', 'Commercial'),
(15, 'Baan Marina ', '2026-02-06', 'Residential'),
(16, 'Eakkamai Penhouse', '2026-02-06', 'Residential'),
(17, 'Baan Pak Chong', '2024-11-19', 'Residential'),
(18, 'Maison Hotel, Bangkok', '2024-06-05', 'Commercial'),
(19, 'Lakeside villa', '2026-03-03', 'Residential');

-- --------------------------------------------------------

--
-- Table structure for table `project_collections`
--

CREATE TABLE `project_collections` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_collections`
--

INSERT INTO `project_collections` (`id`, `project_id`, `collection_id`) VALUES
(36, 3, 4),
(38, 6, 4),
(39, 6, 5),
(47, 7, 6),
(40, 8, 5),
(41, 9, 7),
(44, 10, 6),
(43, 10, 8),
(45, 11, 7),
(46, 12, 5),
(49, 13, 12),
(50, 13, 14),
(52, 14, 10),
(51, 14, 11),
(56, 15, 15),
(55, 15, 17),
(57, 16, 16),
(58, 16, 18),
(66, 17, 22),
(67, 17, 23),
(68, 17, 24),
(61, 18, 8),
(62, 18, 9),
(63, 18, 21),
(69, 19, 25);

-- --------------------------------------------------------

--
-- Table structure for table `project_images`
--

CREATE TABLE `project_images` (
  `image_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_images`
--

INSERT INTO `project_images` (`image_id`, `project_id`, `image_url`, `display_order`) VALUES
(12, 3, '/uploads/admin/7cf2db76-bd79-4d61-83c3-a60deba66be5.jpg', NULL),
(13, 2, '/uploads/admin/8105324f-877c-4e58-b801-3e3ffb9bf65c.jpg', NULL),
(14, 1, '/uploads/admin/128d9b5f-705d-4540-ab75-bd0e62e986d7.jpg', NULL),
(15, 6, '/uploads/admin/4e51490e-ecbb-4485-b61d-5eec562389a3.JPEG', NULL),
(16, 6, '/uploads/admin/6ca59674-a05c-43ee-a61a-1c24981281b0.JPEG', NULL),
(17, 6, '/uploads/admin/9814cfe4-9a16-40f7-a9f2-38411d5fbfa0.JPEG', NULL),
(20, 8, '/uploads/admin/03b1d7c3-f986-46de-a894-6595d98bf320.jpg', NULL),
(21, 8, '/uploads/admin/66040b97-7397-424f-9128-ccfaae430cf1.jpg', NULL),
(22, 8, '/uploads/admin/dc9186ff-4b93-4807-a0b8-26fc008713aa.jpg', NULL),
(23, 7, '/uploads/admin/2a46dca4-5308-4600-ab78-68a69b832b27.JPG', NULL),
(24, 7, '/uploads/admin/f9853c53-ba79-4829-9c0a-09d9b56edb48.JPG', NULL),
(25, 7, '/uploads/admin/b91610eb-576a-4eb9-8d9d-53883d62e004.JPG', NULL),
(26, 9, '/uploads/admin/0426bed2-0795-47bb-8e70-d17e707c3089.jpg', NULL),
(27, 8, '/uploads/admin/cd7f4208-7407-48d0-8db9-d8a6f489b008.jpg', NULL),
(28, 8, '/uploads/admin/773e7487-7822-427a-973b-91e150a6a0dc.jpg', NULL),
(29, 10, '/uploads/admin/2abb095f-7b15-4533-bd07-232818c78a10.jpg', NULL),
(30, 10, '/uploads/admin/ccaf9a35-a5f1-4989-9a6b-c2e174993b16.jpg', NULL),
(31, 10, '/uploads/admin/c35ad87b-32f2-450f-ace0-b334edd4fa88.jpg', NULL),
(32, 10, '/uploads/admin/3a695596-2362-42e7-ba46-3de105a070ad.png', NULL),
(33, 11, '/uploads/admin/6ea7612b-7e4c-4662-89f4-b4dfd313b80d.png', NULL),
(34, 11, '/uploads/admin/a3248ea7-936b-4d1e-b945-7ade7e854c7e.jpg', NULL),
(35, 11, '/uploads/admin/bdc550d2-df4a-48ec-b60c-90e2ab553d34.png', NULL),
(36, 12, '/uploads/admin/980de114-09d2-408b-9a0f-1c5e3fa584ec.jpg', NULL),
(41, 14, '/uploads/admin/7ed9da3d-0833-409b-836d-989b023cfc67.jpg', NULL),
(42, 14, '/uploads/admin/e53c24e7-9000-4d29-8e2d-28a6f4ba46d6.jpg', NULL),
(43, 14, '/uploads/admin/e2c1b5de-c973-4db4-8830-7224fa9d5aed.jpg', NULL),
(44, 14, '/uploads/admin/b689cc6c-630a-4ef3-8dfa-ae0aff5d9a9e.jpg', NULL),
(45, 14, '/uploads/admin/7490e6bf-7e15-474a-8b77-b54e4421da79.jpg', NULL),
(46, 14, '/uploads/admin/c5b6444f-a137-4c5e-b245-295a883c43df.jpg', NULL),
(47, 14, '/uploads/admin/852445bf-9b8d-41b4-800f-a0b3650923cb.jpg', NULL),
(48, 14, '/uploads/admin/8b17fd13-afcc-435f-a534-03fcb5258d7c.jpg', NULL),
(49, 15, '/uploads/admin/87c5e897-335f-40f2-9000-367fe3909ec5.jpg', NULL),
(50, 15, '/uploads/admin/84814a7e-ad81-4860-b014-5cb9533954fc.jpg', NULL),
(51, 15, '/uploads/admin/34d0d798-a19f-43c0-a6f1-a77f6156b0ef.jpg', NULL),
(52, 15, '/uploads/admin/734a788d-886b-4c08-b5e7-f6ad3e3e623c.jpg', NULL),
(54, 15, '/uploads/admin/8ebb9619-fcd4-4ad6-a6e7-a7c76cec3fd4.jpg', NULL),
(55, 16, '/uploads/admin/97553526-e455-4f85-846d-d1b70b07f16a.jpg', NULL),
(56, 16, '/uploads/admin/5027fb2c-ad31-4cfa-b391-daaaad9f5724.jpg', NULL),
(57, 16, '/uploads/admin/7ae326b3-5914-40ce-ae57-d1c6c3c2ceb7.jpg', NULL),
(58, 16, '/uploads/admin/7e3e4885-76d6-4f73-84d3-3bd6e208f829.jpg', NULL),
(59, 17, '/uploads/admin/f1040dbd-eae9-4eda-8cd3-4ed2ad725ae3.jpg', NULL),
(60, 16, '/uploads/admin/b7f976e5-517c-490e-abe4-4f7c83b7b2a9.jpg', NULL),
(61, 17, '/uploads/admin/7802f88c-a623-42e8-80e0-c85006e5bcfe.jpg', NULL),
(63, 16, '/uploads/admin/8e97cd7d-50c3-4a37-9b0c-be613e7dbfdb.jpg', NULL),
(64, 17, '/uploads/admin/57231f20-0b07-453c-bea7-962b9e7a3fe3.jpg', NULL),
(65, 17, '/uploads/admin/20ffbc7b-78e8-4ef7-a7c7-6d454ff77e3f.jpg', NULL),
(66, 17, '/uploads/admin/fc2ceb4b-1c92-46bc-8d7b-9415b04f2fe6.jpg', NULL),
(67, 17, '/uploads/admin/b8756797-3be7-44d8-8181-bc3605f5b790.jpg', NULL),
(68, 17, '/uploads/admin/f7b04828-7db8-4bd3-bec9-87df56687dc2.jpg', NULL),
(70, 13, '/uploads/admin/e61f12dc-65dc-42ca-a162-3828ac85ff41.HEIC', NULL),
(71, 13, '/uploads/admin/be794c8b-5950-4586-beda-37e8dcb6cf5b.HEIC', NULL),
(72, 13, '/uploads/admin/afc4ccfc-1d05-4479-86c5-c321c94967f0.HEIC', NULL),
(74, 18, '/uploads/admin/646191db-1333-4c76-b168-f7eda7d93286.jpg', NULL),
(75, 18, '/uploads/admin/ce3d493c-8520-4fe8-a0f8-81b4e5758126.jpg', NULL),
(76, 19, '/uploads/admin/4757bfb5-05f4-4561-b3f2-5ab8a13253fe.jpg', NULL),
(78, 19, '/uploads/admin/ddad4ddb-66a6-4e3f-8316-f36ce42addec.jpg', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`),
  ADD KEY `idx_main_type` (`main_type`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`collection_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `home_sliders`
--
ALTER TABLE `home_sliders`
  ADD PRIMARY KEY (`slider_id`),
  ADD KEY `idx_display_order` (`display_order`);

--
-- Indexes for table `product_focus`
--
ALTER TABLE `product_focus`
  ADD PRIMARY KEY (`focus_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `product_focus_images`
--
ALTER TABLE `product_focus_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `idx_focus_id` (`focus_id`);

--
-- Indexes for table `product_furnish_items`
--
ALTER TABLE `product_furnish_items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `product_main`
--
ALTER TABLE `product_main`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `product_main_images`
--
ALTER TABLE `product_main_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_main_id` (`product_main_id`);

--
-- Indexes for table `product_surface_items`
--
ALTER TABLE `product_surface_items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `idx_category` (`project_category`),
  ADD KEY `idx_data_update` (`data_update`);

--
-- Indexes for table `project_collections`
--
ALTER TABLE `project_collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_project_collection` (`project_id`,`collection_id`),
  ADD KEY `collection_id` (`collection_id`);

--
-- Indexes for table `project_images`
--
ALTER TABLE `project_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `idx_project_id` (`project_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `collection_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `home_sliders`
--
ALTER TABLE `home_sliders`
  MODIFY `slider_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_focus`
--
ALTER TABLE `product_focus`
  MODIFY `focus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `product_focus_images`
--
ALTER TABLE `product_focus_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `product_furnish_items`
--
ALTER TABLE `product_furnish_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_main`
--
ALTER TABLE `product_main`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_main_images`
--
ALTER TABLE `product_main_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `product_surface_items`
--
ALTER TABLE `product_surface_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `project_collections`
--
ALTER TABLE `project_collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `project_images`
--
ALTER TABLE `project_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `collections`
--
ALTER TABLE `collections`
  ADD CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`);

--
-- Constraints for table `product_focus`
--
ALTER TABLE `product_focus`
  ADD CONSTRAINT `product_focus_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`);

--
-- Constraints for table `product_focus_images`
--
ALTER TABLE `product_focus_images`
  ADD CONSTRAINT `product_focus_images_ibfk_1` FOREIGN KEY (`focus_id`) REFERENCES `product_focus` (`focus_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_main`
--
ALTER TABLE `product_main`
  ADD CONSTRAINT `product_main_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`);

--
-- Constraints for table `product_main_images`
--
ALTER TABLE `product_main_images`
  ADD CONSTRAINT `product_main_images_ibfk_1` FOREIGN KEY (`product_main_id`) REFERENCES `product_main` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_collections`
--
ALTER TABLE `project_collections`
  ADD CONSTRAINT `project_collections_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_collections_ibfk_2` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`collection_id`) ON DELETE CASCADE;

--
-- Constraints for table `project_images`
--
ALTER TABLE `project_images`
  ADD CONSTRAINT `project_images_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
