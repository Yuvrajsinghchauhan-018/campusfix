const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

const initCronJobs = (io) => {
  // Run every hour to check SLA breaches
  // '0 * * * *'
  cron.schedule('* * * * *', async () => {
    console.log('Running SLA escalation check...');
    
    try {
      const pendingComplaints = await Complaint.find({
        status: { $in: ['Assigned', 'In Progress'] },
        deadline: { $lt: new Date() },
        isEscalated: false,
      }).populate('assignedTo', 'name email');

      if (pendingComplaints.length > 0) {
        console.log(`Found ${pendingComplaints.length} SLA breaches. Escalating...`);
        
        // Find Admins to notify
        const admins = await User.find({ role: 'admin' }).select('email');
        const adminEmails = admins.map(a => a.email).join(',');

        for (const complaint of pendingComplaints) {
          complaint.isEscalated = true;
          await complaint.save();

          // Send Email to Admins
          if (adminEmails) {
             await sendEmail({
               email: adminEmails,
               subject: `[ESCALATION] Ticket #${complaint._id.toString().slice(-6)} SLA Breached`,
               message: `The ticket "${complaint.title}" assigned to ${complaint.assignedTo?.name || 'Unknown'} has breached its deadline (${complaint.deadline}). Please review immediately.`
             });
          }

          // Emit real-time warning to authority/admin rooms
          if (io) {
             io.emit('escalation_alert', {
                complaintId: complaint._id,
                message: `Ticket "${complaint.title}" has breached SLA.`
             });
          }
        }
      }
    } catch (err) {
      console.error('Error running SLA cron job:', err);
    }
  });
};

module.exports = initCronJobs;
