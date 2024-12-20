
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
        INSERT INTO ORDER_FOOD VALUES (@ID_Order, @ID_BranchFood, @Quantity);
    END;
END;
