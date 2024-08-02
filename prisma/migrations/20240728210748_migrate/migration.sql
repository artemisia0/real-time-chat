-- CreateTable
CREATE TABLE "Chat" (
    "ID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "User" (
    "ID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ChatAndUserRelation" (
    "userID" INTEGER NOT NULL,
    "chatID" INTEGER NOT NULL,

    CONSTRAINT "ChatAndUserRelation_pkey" PRIMARY KEY ("userID","chatID")
);

-- AddForeignKey
ALTER TABLE "ChatAndUserRelation" ADD CONSTRAINT "ChatAndUserRelation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatAndUserRelation" ADD CONSTRAINT "ChatAndUserRelation_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "Chat"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
