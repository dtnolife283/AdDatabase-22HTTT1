USE master;
GO

-- Create the database
CREATE DATABASE DOANCSDLNC;
GO

-- Switch to the new database
USE DOANCSDLNC;
GO

CREATE TABLE PARKING (
    ID_Parking INT,
    Address NVARCHAR(50) NOT NULL,
    OpeningHour TIME NOT NULL,
    CloseHour TIME NOT NULL,
    ParkingType INT NOT NULL CHECK (ParkingType IN (0, 1)),
    ID_Branch INT,
    CONSTRAINT PK_PARKING PRIMARY KEY (ID_Parking),
	CONSTRAINT CHK_Parking_Opening_Closing_Hours CHECK (OpeningHour < CloseHour)
);

CREATE TABLE BRANCH (
    ID_Branch INT,
    BranchName NVARCHAR(50) NOT NULL UNIQUE,
    Address NVARCHAR(50) NOT NULL,
    PhoneNumber CHAR(10) NOT NULL UNIQUE,
    OpeningHour TIME NOT NULL,
    CloseHour TIME NOT NULL,
    ID_Employee INT,
    ID_Area INT,
    CONSTRAINT PK_BRANCH PRIMARY KEY (ID_Branch),
    CONSTRAINT CHK_Branch_Opening_Closing_Hours CHECK (OpeningHour < CloseHour)
);

CREATE TABLE AREA (
    ID_Area INT NOT NULL,
    AreaName VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT PK_AREA PRIMARY KEY (ID_Area)
);

CREATE TABLE FOOD_ITEM (
    ID_Food INT,
    FoodName NVARCHAR(50) NOT NULL UNIQUE,
    Price INT NOT NULL CHECK (Price > 0),
    IsAreaRestricted INT NOT NULL DEFAULT 0 CHECK (IsAreaRestricted IN (0, 1)),
    DeliverySafe INT NOT NULL DEFAULT 1 CHECK (DeliverySafe IN (0, 1)),
    ID_Type INT,
    CONSTRAINT PK_FOOD_ITEM PRIMARY KEY (ID_Food)
);

CREATE TABLE FOOD_TYPE (
    ID_Type INT,
    TypeName NVARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT PK_FOOD_TYPE PRIMARY KEY (ID_Type)
);

CREATE TABLE AREA_SPECIFIC_FOOD (
    ID_Area INT NOT NULL,
    ID_Food INT NOT NULL,
    CONSTRAINT PK_AREA_SPECIFIC_FOOD PRIMARY KEY (ID_Area, ID_Food)
);

CREATE TABLE BRANCH_FOOD (
    ID_BranchFood INT,
    Available INT NOT NULL DEFAULT 1 CHECK (Available IN (0, 1)),
    ID_Branch INT NOT NULL,
    ID_Food INT NOT NULL,
    CONSTRAINT PK_BRANCH_FOOD PRIMARY KEY (ID_BranchFood),
    CONSTRAINT UNQ_BRANCH_FOOD UNIQUE (ID_Branch, ID_Food)
);

CREATE TABLE [ORDER] (
    ID_Order INT,
    ID_Table INT,
    OrderDate DATE NOT NULL DEFAULT GETDATE(),
    TotalPrice INT,
    ActualPrice INT,
    ID_Customer INT,
    ID_Review INT,
    ID_Employee INT,
    ID_Branch INT,
    CONSTRAINT PK_ID_ORDER PRIMARY KEY (ID_Order)
);

CREATE TABLE REVIEW (
    ID_Review INT,
    ServiceScore INT NOT NULL CHECK (ServiceScore >= 0 AND ServiceScore <= 5),
    FoodScore INT NOT NULL CHECK (FoodScore >= 0 AND FoodScore <= 5),
    BranchScore INT NOT NULL CHECK (BranchScore >= 0 AND BranchScore <= 5),
    PriceScore INT NOT NULL CHECK (PriceScore >= 0 AND PriceScore <= 5),
    Comment NVARCHAR(500),
    CONSTRAINT PK_REVIEW PRIMARY KEY (ID_Review)
);

CREATE TABLE ONLINE_ORDER (
    ID_Online INT,
    TimeOrder TIME NOT NULL,
    CONSTRAINT PK_ONLINE_ORDER PRIMARY KEY (ID_Online)
);

CREATE TABLE RESERVATION_ORDER (
    ID_Reservation INT,
    ID_Table INT,
    ArrivalTime TIME NOT NULL,
    NumberOfPeople INT NOT NULL CHECK (NumberOfPeople > 0),
    Notes NVARCHAR(500),
    CONSTRAINT PK_RESERVATION_ORDER PRIMARY KEY (ID_Reservation)
);

CREATE TABLE [TABLE] (
    ID_Table INT,
    NumberOfSeats INT NOT NULL CHECK (NumberOfSeats > 0),
    StatusTable INT NOT NULL DEFAULT 0 CHECK (StatusTable IN (0, 1)),
    ID_Branch INT,
    CONSTRAINT PK_TABLE PRIMARY KEY (ID_Table)
);

CREATE TABLE ORDER_FOOD (
    ID_BranchFood INT,
    ID_Order INT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    CONSTRAINT PK_ORDER_FOOD PRIMARY KEY (ID_BranchFood, ID_Order)
);

CREATE TABLE EMP_BRANCH_HISTORY (
    ID_Employee INT,
    ID_Branch INT,
    StartDate DATE NOT NULL,
    EndDate DATE,
    CONSTRAINT PK_EmpBranchHistory PRIMARY KEY (ID_Employee, ID_Branch, StartDate),
    CONSTRAINT CHK_EndDate_After_StartDate CHECK (EndDate IS NULL OR EndDate >= StartDate)
);


CREATE TABLE EMPLOYEE (
    ID_Employee INT,
    EmployeeName NVARCHAR(50) NOT NULL,
    DoB DATE NOT NULL,
    PhoneNumber CHAR(10) NOT NULL UNIQUE,
    Gender CHAR(1) NOT NULL CHECK (Gender IN ('M', 'F')),
    ID_Department INT,
    CONSTRAINT PK_EMPLOYEE PRIMARY KEY (ID_Employee)
);

CREATE TABLE EMPLOYEE_LEAVE_BALANCE (
    TotalDays INT NOT NULL DEFAULT 12 CHECK (TotalDays >= 0),
    RemainingDays INT NOT NULL DEFAULT 12 CHECK (RemainingDays >= 0),
    ID_Employee INT,
    CONSTRAINT PK_EmployeeLeaveBalance PRIMARY KEY (ID_Employee),
    CONSTRAINT CHK_Remaining_Total_Days CHECK (RemainingDays <= TotalDays)
);

CREATE TABLE EMPLOYEE_DAY_OFF (
    ID_DayOff INT,
    Date DATE NOT NULL,
    ApprovalStatus INT CHECK (ApprovalStatus IN (0, 1)),
    ID_Employee INT NOT NULL,
    isPaidDayOff INT NOT NULL DEFAULT 0 CHECK (isPaidDayOff IN (0, 1)),
    Reason NVARCHAR(500),
    Deduction INT CHECK (Deduction >= 0),
    CONSTRAINT PK_EmployeeDayOff PRIMARY KEY (ID_DayOff)
);

CREATE TABLE MEMBERSHIP (
    ID_Card INT,
    Status INT NOT NULL DEFAULT 1 CHECK (Status IN (0, 1)),
    DateCreated DATE NOT NULL DEFAULT GETDATE(),
    Point INT NOT NULL DEFAULT 0 CHECK (Point >= 0),
    ID_Level INT,
    ID_Employee INT,
    CONSTRAINT PK_Membership PRIMARY KEY (ID_Card)
);

CREATE TABLE POINT_HISTORY (
    ID_PointHistory INT,
    Point INT NOT NULL CHECK (Point >= 0),
    Year INT NOT NULL,
    ID_Customer INT,
    CONSTRAINT PK_PointHistory PRIMARY KEY (ID_PointHistory)
);

CREATE TABLE MEM_LEVEL (
    ID_Level INT,
    LevelName VARCHAR(50) NOT NULL UNIQUE,
    DiscountPercentages INT NOT NULL CHECK (DiscountPercentages >= 0 AND DiscountPercentages <= 100),
    CONSTRAINT PK_MemLevel PRIMARY KEY (ID_Level)
);

CREATE TABLE CUSTOMER (
    ID_Customer INT NOT NULL,
    CustomerName VARCHAR(50) NOT NULL,
    PhoneNumber CHAR(10) NOT NULL UNIQUE,
    Gender CHAR(1) NOT NULL CHECK (Gender IN ('M', 'F')),
    Email VARCHAR(50) NOT NULL UNIQUE,
    SSID CHAR(10) NOT NULL UNIQUE,
    ID_Card INT
    CONSTRAINT PK_Customer PRIMARY KEY (ID_Customer)
);

CREATE TABLE DEPARTMENT (
    ID_Department INT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    Salary INT NOT NULL CHECK (Salary > 0),
    CONSTRAINT PK_Department PRIMARY KEY (ID_Department)
);

ALTER TABLE PARKING
ADD 
    CONSTRAINT FK_PARKING_BRANCH 
    FOREIGN KEY (ID_Branch) 
    REFERENCES BRANCH(ID_Branch) ON DELETE CASCADE;

ALTER TABLE BRANCH
ADD 
    CONSTRAINT FK_BRANCH_EMPLOYEE 
    FOREIGN KEY (ID_Employee) 
    REFERENCES EMPLOYEE(ID_Employee) ON DELETE SET NULL;

ALTER TABLE BRANCH
ADD 
    CONSTRAINT FK_BRANCH_AREA 
    FOREIGN KEY (ID_Area) 
    REFERENCES AREA(ID_Area) ON DELETE NO ACTION;

ALTER TABLE FOOD_ITEM
ADD 
    CONSTRAINT FK_FOOD_TYPE 
    FOREIGN KEY (ID_Type) 
    REFERENCES FOOD_TYPE(ID_Type) ON DELETE SET NULL;

ALTER TABLE AREA_SPECIFIC_FOOD
ADD
    CONSTRAINT FK_AREA_SPECIFIC_FOOD_AREA
    FOREIGN KEY (ID_Area)
    REFERENCES AREA(ID_Area) ON DELETE CASCADE;

ALTER TABLE AREA_SPECIFIC_FOOD
ADD
    CONSTRAINT FK_AREA_SPECIFIC_FOOD_FOOD
    FOREIGN KEY (ID_Food)
    REFERENCES FOOD_ITEM(ID_Food) ON DELETE CASCADE;

ALTER TABLE BRANCH_FOOD
ADD
    CONSTRAINT FK_BRANCH_FOOD_BRANCH
    FOREIGN KEY (ID_Branch)
    REFERENCES BRANCH(ID_Branch) ON DELETE CASCADE;

ALTER TABLE BRANCH_FOOD
ADD
    CONSTRAINT FK_BRANCH_FOOD_FOOD
    FOREIGN KEY (ID_Food)
    REFERENCES FOOD_ITEM(ID_Food) ON DELETE CASCADE;

ALTER TABLE [ORDER]
ADD
    CONSTRAINT FK_ORDER_CUSTOMER
    FOREIGN KEY (ID_Customer)
    REFERENCES CUSTOMER(ID_Customer) ON DELETE SET NULL;

ALTER TABLE [ORDER]
ADD
    CONSTRAINT FK_ORDER_REVIEW
    FOREIGN KEY (ID_Review)
    REFERENCES REVIEW(ID_Review) ON DELETE SET NULL;

ALTER TABLE [ORDER]
ADD
    CONSTRAINT FK_ORDER_EMPLOYEE
    FOREIGN KEY (ID_Employee)
    REFERENCES EMPLOYEE(ID_Employee) ON DELETE SET NULL;

ALTER TABLE [ORDER]
ADD
    CONSTRAINT FK_ORDER_TABLE
    FOREIGN KEY (ID_Table)
    REFERENCES [TABLE](ID_Table) ON DELETE SET NULL;

ALTER TABLE [ORDER]
ADD
    CONSTRAINT FK_ORDER_BRANCH
    FOREIGN KEY (ID_Branch)
    REFERENCES BRANCH(ID_Branch) ON DELETE CASCADE;

ALTER TABLE ONLINE_ORDER
ADD
    CONSTRAINT FK_ONLINE_ORDER_ORDER
    FOREIGN KEY (ID_Online)
    REFERENCES [ORDER](ID_Order) ON DELETE CASCADE;

ALTER TABLE RESERVATION_ORDER
ADD
    CONSTRAINT FK_RESERVATION_ORDER_ORDER
    FOREIGN KEY (ID_Reservation)
    REFERENCES [ORDER](ID_Order) ON DELETE CASCADE;

ALTER TABLE [TABLE]
ADD
    CONSTRAINT FK_TABLE_BRANCH
    FOREIGN KEY (ID_Branch)
    REFERENCES BRANCH(ID_Branch);

ALTER TABLE ORDER_FOOD
ADD
    CONSTRAINT FK_ORDER_FOOD_BRANCH_FOOD
    FOREIGN KEY (ID_BranchFood)
    REFERENCES BRANCH_FOOD(ID_BranchFood);

ALTER TABLE ORDER_FOOD
ADD
    CONSTRAINT FK_ORDER_FOOD_ORDER
    FOREIGN KEY (ID_Order)
    REFERENCES [ORDER](ID_Order) ON DELETE CASCADE;

ALTER TABLE EMP_BRANCH_HISTORY
ADD
    CONSTRAINT FK_EMP_BRANCH_HISTORY_EMPLOYEE
    FOREIGN KEY (ID_Employee)
    REFERENCES EMPLOYEE(ID_Employee) ON DELETE CASCADE;

ALTER TABLE EMP_BRANCH_HISTORY
ADD
    CONSTRAINT FK_EMP_BRANCH_HISTORY_BRANCH
    FOREIGN KEY (ID_Branch)
    REFERENCES BRANCH(ID_Branch) ON DELETE CASCADE;

ALTER TABLE EMPLOYEE
ADD
    CONSTRAINT FK_EMPLOYEE_DEPARTMENT
    FOREIGN KEY (ID_Department)
    REFERENCES DEPARTMENT(ID_Department) ON DELETE SET NULL;

ALTER TABLE EMPLOYEE_LEAVE_BALANCE
ADD
    CONSTRAINT FK_EMPLOYEE_LEAVE_BALANCE_EMPLOYEE
    FOREIGN KEY (ID_Employee)
    REFERENCES EMPLOYEE(ID_Employee) ON DELETE CASCADE;

ALTER TABLE EMPLOYEE_DAY_OFF
ADD
    CONSTRAINT FK_EMPLOYEE_DAY_OFF_EMPLOYEE
    FOREIGN KEY (ID_Employee)
    REFERENCES EMPLOYEE(ID_Employee) ON DELETE CASCADE;

ALTER TABLE MEMBERSHIP
ADD
    CONSTRAINT FK_MEMBERSHIP_LEVEL
    FOREIGN KEY (ID_Level)
    REFERENCES MEM_LEVEL(ID_Level);

ALTER TABLE MEMBERSHIP
ADD
    CONSTRAINT FK_MEMBERSHIP_EMPLOYEE
    FOREIGN KEY (ID_Employee)
    REFERENCES EMPLOYEE(ID_Employee) ON DELETE SET NULL;

ALTER TABLE POINT_HISTORY
ADD
    CONSTRAINT FK_POINT_HISTORY_MEMBERSHIP
    FOREIGN KEY (ID_Customer)
    REFERENCES CUSTOMER(ID_Customer) ON DELETE CASCADE;

ALTER TABLE CUSTOMER
ADD
    CONSTRAINT FK_CUSTOMER_MEMBERSHIP
    FOREIGN KEY (ID_Card)
    REFERENCES MEMBERSHIP(ID_Card) ON DELETE SET NULL;
GO

CREATE TRIGGER trg_DeleteCascadeTable
ON Branch
AFTER DELETE
AS
BEGIN
    DELETE FROM [TABLE] WHERE ID_Branch IN (SELECT ID_Branch FROM deleted);
END;
GO

CREATE TRIGGER trg_UpdateLeaveBalance
ON EMPLOYEE_DAY_OFF
AFTER INSERT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE isPaidDayOff = 1)
    BEGIN
        UPDATE EMPLOYEE_LEAVE_BALANCE
        SET RemainingDays = RemainingDays - 1
        FROM EMPLOYEE_LEAVE_BALANCE E
        JOIN inserted I ON E.ID_Employee = i.ID_Employee
        WHERE I.isPaidDayOff = 1;
    END
END;
GO

CREATE TRIGGER trg_PreventPaidDayOff
ON EMPLOYEE_DAY_OFF
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted I
        JOIN EMPLOYEE_LEAVE_BALANCE E
        ON I.ID_Employee = E.ID_Employee
        WHERE I.isPaidDayOff = 1 AND E.RemainingDays = 0
    )
    BEGIN
        RAISERROR ('Employee cannot take a paid day off as remaining leave balance is zero', 16, 1);
        RETURN;
    END
    INSERT INTO EMPLOYEE_DAY_OFF (ID_DayOff, Date, ApprovalStatus, ID_Employee, isPaidDayOff, Reason, Deduction)
    SELECT ID_DayOff, Date, ApprovalStatus, ID_Employee, isPaidDayOff, Reason, Deduction
    FROM inserted;
END;
GO

CREATE TRIGGER trg_CheckBranchFood
ON BRANCH_FOOD
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted I
        JOIN FOOD_ITEM F ON I.ID_Food = F.ID_Food
        JOIN BRANCH B ON I.ID_Branch = B.ID_Branch
        WHERE F.IsAreaRestricted = 1 AND B.ID_Area NOT IN (
            SELECT ID_Area
            FROM AREA_SPECIFIC_FOOD
            WHERE ID_Food = I.ID_Food
        )
    )
    BEGIN
        RAISERROR ('This food is restricted in this area', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

--CREATE TRIGGER trg_CheckEmployeeHandlingOrder
--ON [ORDER]
--AFTER INSERT, UPDATE
--AS
--BEGIN
--    IF EXISTS (
--        SELECT 1
--        FROM inserted I
--        WHERE NOT EXISTS (
--            SELECT 1
--            FROM EMP_BRANCH_HISTORY EB
--            WHERE EB.ID_Employee = I.ID_Employee
--              AND I.ID_Branch = EB.ID_Branch
--              AND EB.EndDate IS NULL
--        )
--    )
--    BEGIN
--        RAISERROR ('Employee is not working at the branch at the time of order', 16, 1);
--        ROLLBACK TRANSACTION;
--    END
--END;
--GO


/*
CREATE TRIGGER trg_CheckFoodAvailability
ON ORDER_FOOD
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted I
        JOIN BRANCH_FOOD BF ON I.ID_BranchFood = BF.ID_BranchFood
        WHERE BF.Available = 0
    )
    BEGIN
        RAISERROR ('The food item ordered is not currently available', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
*/
CREATE PROCEDURE sp_UpdateLostCard
    @ID_Customer INT,
    @NewCard INT
AS
BEGIN
    DECLARE @OldCard INT, @Level INT, @Point INT, @Employee INT;
    SELECT @OldCard = M.ID_Card, @Level = M.ID_Level, @Point = M.Point, @Employee = M.ID_Employee
    FROM CUSTOMER C, MEMBERSHIP M
    WHERE C.ID_Customer = @ID_Customer AND C.ID_Card = M.ID_Card

    DELETE FROM MEMBERSHIP
    WHERE ID_Card = @OldCard;

    INSERT INTO MEMBERSHIP (ID_Card, Status, DateCreated, Point, ID_Level, ID_Employee)
    VALUES (@NewCard, 1, GETDATE(), @Point, @Level, @Employee);

    UPDATE CUSTOMER
    SET ID_Card = @NewCard
    WHERE ID_Customer = @ID_Customer;
END
GO

CREATE OR ALTER PROC SP_ViewBranchFood
    @ID_Branch INT
AS
BEGIN
    SELECT FI.ID_Food, FI.FoodName, BF.Available
    FROM FOOD_ITEM FI
        JOIN BRANCH_FOOD BF ON FI.ID_Food = BF.ID_Food
        JOIN BRANCH B ON BF.ID_Branch = B.ID_Branch
    WHERE B.ID_Branch = @ID_Branch
END
GO

CREATE OR ALTER FUNCTION dbo.getDailyIncome(@ID_Branch INT, @year INT, @month INT, @date INT)
RETURNS INT
WITH RETURNS NULL ON NULL INPUT
AS
BEGIN
    RETURN (
        SELECT SUM(ActualPrice)
        FROM [ORDER]
        WHERE @ID_Branch = ID_Branch
          AND OrderDate >= DATEFROMPARTS(@year, @month, @date)
          AND OrderDate < DATEADD(DAY, 1, DATEFROMPARTS(@year, @month, @date))
    )
END
GO

CREATE OR ALTER FUNCTION dbo.getMonthlyIncome(@ID_Branch INT, @year INT, @month INT)
RETURNS INT
WITH RETURNS NULL ON NULL INPUT
AS
BEGIN
    RETURN (
        SELECT SUM(ActualPrice)
        FROM [ORDER]
        WHERE @ID_Branch = ID_Branch
          AND OrderDate >= DATEFROMPARTS(@year, @month, 1)
          AND OrderDate < DATEADD(MONTH, 1, DATEFROMPARTS(@year, @month, 1))
    )
END
GO

CREATE OR ALTER FUNCTION dbo.getYearlyIncome(@ID_Branch INT, @year INT)
RETURNS INT
WITH RETURNS NULL ON NULL INPUT
AS
BEGIN
    RETURN (
        SELECT SUM(ActualPrice)
        FROM [ORDER]
        WHERE @ID_Branch = ID_Branch
          AND OrderDate >= DATEFROMPARTS(@year, 1, 1)
          AND OrderDate < DATEADD(YEAR, 1, DATEFROMPARTS(@year, 1, 1))
    )
END
GO

CREATE OR ALTER PROC SP_GetBranchIncome
    @ID_Branch INT
AS
BEGIN
    DECLARE @YearlyIncome INT
    DECLARE @MonthlyIncome INT
    DECLARE @DailyIncome INT

    SET @YearlyIncome = dbo.getYearlyIncome(@ID_Branch, YEAR(GETDATE()))
    SET @MonthlyIncome = dbo.getMonthlyIncome(@ID_Branch, YEAR(GETDATE()), MONTH(GETDATE()))
    SET @DailyIncome = dbo.getDailyIncome(@ID_Branch, YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()))

    -- Print the results
    PRINT 'Yearly income: ' + CAST(@YearlyIncome AS NVARCHAR(50))
    PRINT 'Monthly income: ' + CAST(@MonthlyIncome AS NVARCHAR(50))
    PRINT 'Daily income: ' + CAST(@DailyIncome AS NVARCHAR(50))
END
GO

-- Them mon
CREATE PROCEDURE AddFoodItem 
    @FoodName NVARCHAR(50),
    @Price INT,
    @IsAreaRestricted INT = 0,
    @DeliverySafe INT = 1,
    @ID_Type INT = NULL
AS
BEGIN
    IF (@Price <= 0 OR @IsAreaRestricted NOT IN (0, 1) OR @DeliverySafe NOT IN (0, 1))
    BEGIN
        RAISERROR('Invalid input parameters.', 16, 1);
        RETURN;
    END

    IF (@ID_Type IS NOT NULL AND NOT EXISTS (SELECT 1 FROM FOOD_TYPE WHERE ID_Type = @ID_Type))
    BEGIN
        RAISERROR('Invalid Food Type ID.', 16, 1);
        RETURN;
    END

    INSERT INTO FOOD_ITEM (FoodName, Price, IsAreaRestricted, DeliverySafe, ID_Type)
    VALUES (@FoodName, @Price, @IsAreaRestricted, @DeliverySafe, @ID_Type);

    PRINT 'Food item added successfully.';
END;

GO

-- xuat hoa don
CREATE PROCEDURE GenerateInvoice 
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Declare variables for order details
    DECLARE @CustomerName NVARCHAR(50),
            @OrderDate DATE,
            @TotalPrice INT,
            @ActualPrice INT,
            @BranchName NVARCHAR(50),
            @EmployeeName NVARCHAR(50);

    -- Fetch basic order details
    SELECT 
        @CustomerName = ISNULL(C.CustomerName, 'N/A'), 
        @OrderDate = O.OrderDate, 
        @TotalPrice = O.TotalPrice, 
        @ActualPrice = O.ActualPrice, 
        @BranchName = ISNULL(B.BranchName, 'N/A'), 
        @EmployeeName = ISNULL(E.EmployeeName, 'N/A')
    FROM [ORDER] O
    LEFT JOIN CUSTOMER C ON O.ID_Customer = C.ID_Customer
    LEFT JOIN BRANCH B ON O.ID_Branch = B.ID_Branch
    LEFT JOIN EMPLOYEE E ON O.ID_Employee = E.ID_Employee
    WHERE O.ID_Order = @OrderID;

    -- Print invoice header
    PRINT '--------------------------------------------------';
    PRINT '                  INVOICE';
    PRINT '--------------------------------------------------';
    PRINT 'Order ID: ' + CAST(@OrderID AS NVARCHAR);
    PRINT 'Order Date: ' + CAST(@OrderDate AS NVARCHAR);
    PRINT 'Customer: ' + @CustomerName;
    PRINT 'Branch: ' + @BranchName;
    PRINT 'Employee: ' + @EmployeeName;
    PRINT '--------------------------------------------------';

    -- Print ordered food items
    PRINT 'Food Items:';
    PRINT '--------------------------------------------------';
    PRINT 'Food Name         | Quantity | Price';
    PRINT '--------------------------------------------------';

    -- Display food items using SELECT
    SELECT 
        FI.FoodName AS [Food Name], 
        OFD.Quantity, 
        FI.Price
    FROM ORDER_FOOD OFD
    JOIN BRANCH_FOOD BF ON OFD.ID_BranchFood = BF.ID_BranchFood
    JOIN FOOD_ITEM FI ON BF.ID_Food = FI.ID_Food
    WHERE OFD.ID_Order = @OrderID;

    -- Print totals
    PRINT '--------------------------------------------------';
    PRINT 'Total Price: ' + CAST(@TotalPrice AS NVARCHAR);
    PRINT 'Actual Price (After Discount): ' + CAST(@ActualPrice AS NVARCHAR);
    PRINT '--------------------------------------------------';

    PRINT 'Thank you for your purchase!';
END;
GO

CREATE OR ALTER PROC sp_UpdateCardStatus
    @ID_Customer INT
AS
BEGIN
    DECLARE @ID_Card INT, @Point INT, @ID_Level INT, @MemLevel VARCHAR(50), @DateCreated DATE

    SELECT @ID_Card = ID_Card
    FROM CUSTOMER
    WHERE ID_Customer = @ID_Customer

    IF @ID_Card IS NULL
    BEGIN
        PRINT 'USER HAS NO CARD.'
        RETURN
    END

    SELECT 
        @Point = M.Point,
        @ID_Level = M.ID_Level,
        @MemLevel = ML.LevelName,
        @DateCreated = M.DateCreated
    FROM MEMBERSHIP M
    JOIN MEM_LEVEL ML ON M.ID_Level = ML.ID_Level
    WHERE M.ID_Card = @ID_Card

    -- IF DATEADD(YEAR, 1, @DateCreated) > GETDATE()
    -- BEGIN
    --     RETURN
    -- END

    IF @MemLevel = 'Membership'
    BEGIN
        IF @Point > 100
        BEGIN
            UPDATE MEMBERSHIP 
            SET DateCreated = GETDATE(), Point = 0 
            WHERE ID_Card = @ID_Card

            UPDATE MEM_LEVEL 
            SET LevelName = 'Silver', DiscountPercentages = 20
            WHERE ID_Level = @ID_Level
        END
    END
    ELSE IF @MemLevel = 'Silver'
    BEGIN
        IF @Point < 50
        BEGIN
            UPDATE MEMBERSHIP 
            SET DateCreated = GETDATE(), Point = 0 
            WHERE ID_Card = @ID_Card

            UPDATE MEM_LEVEL 
            SET LevelName = 'Membership', DiscountPercentages = 0
            WHERE ID_Level = @ID_Level
        END
        ELSE IF @Point >= 50 AND @Point < 100
        BEGIN
        UPDATE MEMBERSHIP 
            SET DateCreated = GETDATE(), Point = 0 
            WHERE ID_Card = @ID_Card
        END
        ELSE
        BEGIN
            UPDATE MEMBERSHIP 
            SET DateCreated = GETDATE(), Point = 0 
            WHERE ID_Card = @ID_Card

            UPDATE MEM_LEVEL 
            SET LevelName = 'Gold', DiscountPercentages = 30
            WHERE ID_Level = @ID_Level
        END
    END
    ELSE
    BEGIN
        IF @Point < 100
        BEGIN
            UPDATE MEMBERSHIP 
            SET DateCreated = GETDATE(), Point = 0 
            WHERE ID_Card = @ID_Card

            UPDATE MEM_LEVEL 
            SET LevelName = 'Silver', DiscountPercentages = 20
            WHERE ID_Level = @ID_Level
        END
        ELSE
        BEGIN
            UPDATE MEMBERSHIP 
            SET DateCreated = GETDATE(), Point = 0 
            WHERE ID_Card = @ID_Card
        END
    END
    -- Điều kiện ĐẠT hạng thẻ SILVER: có tổng giá trị tiêu dùng tích lũy từ 10.000.000 VNĐ (100 điểm).
    
    -- Điều kiện GIỮ hạng thẻ SILVER: có tổng giá trị tiêu dùng tích lũy từ 
    -- 5.000.000 VNĐ (50 điểm) trong vòng 01 năm kể từ ngày đạt thẻ SILVER.

    -- Điều kiện NÂNG hạng thẻ GOLD: có tổng giá trị tiêu dùng tích lũy từ
    -- 10.000.000 VNĐ (100 điểm) trong vòng 01 năm kể từ ngày đạt thẻ SILVER.

    -- Nếu trong vòng 01 năm kể từ ngày đạt thẻ SILVER có tổng giá trị tiêu 
    -- dùng tích lũy dưới 5.000.000 VNĐ (50 điểm): thẻ sẽ trở lại mức ban đầu là Membership

    -- Điều kiện ĐẠT hạng thẻ GOLD: có tổng giá trị tiêu dùng tích lũy từ
    -- 10.000.000 VNĐ (100 điểm) trong vòng 01 năm kể từ ngày đạt thẻ SILVER.

    -- Điều kiện GIỮ hạng thẻ GOLD: có tổng giá trị tiêu dùng tích lũy từ
    -- 10.000.000 VNĐ (100 điểm) trong vòng 01 năm kể từ ngày đạt thẻ GOLD.
    -- Nếu trong vòng 01 năm kể từ ngày đạt thẻ GOLD có tổng giá trị tiêu
    -- dùng tích lũy dưới 10.000.000 VNĐ (100 điểm): thẻ sẽ xuống hạng SILVER
END
GO

CREATE PROC INSERT_ORDER_FOOD
    @ID_BranchFood INT,
    @ID_Order INT,
    @Quantity INT
AS
BEGIN
    --check if quantity = 0, if so do not insert
    IF @Quantity = 0
    BEGIN
        PRINT 'Quantity cannot be 0';
        RETURN;
    END;

    IF  EXISTS (SELECT ID_Order FROM [ORDER] WHERE ID_Order = @ID_Order)
    AND EXISTS (SELECT ID_BranchFood FROM BRANCH_FOOD WHERE ID_BranchFood = @ID_BranchFood)
    BEGIN
        INSERT INTO ORDER_FOOD (ID_Order, ID_BranchFood, Quantity) VALUES (@ID_Order, @ID_BranchFood, @Quantity);
    END;
END;
GO