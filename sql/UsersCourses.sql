/*
 Navicat Premium Dump SQL

 Source Server         : TrainingVideo
 Source Server Type    : SQL Server
 Source Server Version : 16004125 (16.00.4125)
 Source Host           : localhost:1433
 Source Catalog        : MyTraining
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 16004125 (16.00.4125)
 File Encoding         : 65001

 Date: 10/06/2024 09:53:34
*/


-- ----------------------------
-- Table structure for UsersCourses
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[UsersCourses]') AND type IN ('U'))
	DROP TABLE [dbo].[UsersCourses]
GO

CREATE TABLE [dbo].[UsersCourses] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [user_id] int  NOT NULL,
  [course_id] int  NOT NULL,
  [watched] int DEFAULT 0 NULL
)
GO

ALTER TABLE [dbo].[UsersCourses] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Auto increment value for UsersCourses
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[UsersCourses]', RESEED, 1)
GO


-- ----------------------------
-- Primary Key structure for table UsersCourses
-- ----------------------------
ALTER TABLE [dbo].[UsersCourses] ADD CONSTRAINT [PK__UsersCou__3213E83FF17F0845] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Foreign Keys structure for table UsersCourses
-- ----------------------------
ALTER TABLE [dbo].[UsersCourses] ADD CONSTRAINT [FK__UsersCour__user___49C3F6B7] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

ALTER TABLE [dbo].[UsersCourses] ADD CONSTRAINT [FK__UsersCour__cours__4AB81AF0] FOREIGN KEY ([course_id]) REFERENCES [dbo].[Courses] ([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

