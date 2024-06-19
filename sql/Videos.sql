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

 Date: 10/06/2024 09:53:43
*/


-- ----------------------------
-- Table structure for Videos
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Videos]') AND type IN ('U'))
	DROP TABLE [dbo].[Videos]
GO

CREATE TABLE [dbo].[Videos] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [title] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [course_id] int  NOT NULL,
  [created_at] datetime DEFAULT getdate() NULL,
  [updated_at] datetime DEFAULT getdate() NULL
)
GO

ALTER TABLE [dbo].[Videos] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Auto increment value for Videos
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Videos]', RESEED, 1001)
GO


-- ----------------------------
-- Primary Key structure for table Videos
-- ----------------------------
ALTER TABLE [dbo].[Videos] ADD CONSTRAINT [PK__Videos__3213E83FBE2DE3B7] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Foreign Keys structure for table Videos
-- ----------------------------
ALTER TABLE [dbo].[Videos] ADD CONSTRAINT [FK__Videos__course_i__3F466844] FOREIGN KEY ([course_id]) REFERENCES [dbo].[Courses] ([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

