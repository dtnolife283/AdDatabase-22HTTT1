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