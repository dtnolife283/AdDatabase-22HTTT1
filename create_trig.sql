
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