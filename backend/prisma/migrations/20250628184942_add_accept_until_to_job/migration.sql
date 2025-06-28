-- AlterTable
ALTER TABLE "Bid" ALTER COLUMN "eta" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "acceptUntil" TIMESTAMP(3);
