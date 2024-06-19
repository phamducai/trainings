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

 Date: 10/06/2024 09:53:13
*/


-- ----------------------------
-- Table structure for Courses
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Courses]') AND type IN ('U'))
	DROP TABLE [dbo].[Courses]
GO

CREATE TABLE [dbo].[Courses] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [title] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [description] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [imgSrc] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [created_by] int  NULL,
  [created_at] datetime DEFAULT getdate() NULL,
  [updated_at] datetime  NULL,
  [total_videos] int DEFAULT 0 NULL
)
GO

ALTER TABLE [dbo].[Courses] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Auto increment value for Courses
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Courses]', RESEED, 1001)
GO


-- ----------------------------
-- Primary Key structure for table Courses
-- ----------------------------
ALTER TABLE [dbo].[Courses] ADD CONSTRAINT [PK__Courses__3213E83F9EC1DCBD] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO

