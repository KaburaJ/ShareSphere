--Notification trigger

CREATE TRIGGER CreateNotificationTrigger
ON Notifications
AFTER INSERT
AS
BEGIN
  DECLARE @recipientID uniqueidentifier;
  SELECT @recipientID = ReceipientID FROM inserted;

  SELECT 'You have a new notification!' as Result;
  SELECT * FROM Notifications WHERE ReceipientID = @recipientID;
END;