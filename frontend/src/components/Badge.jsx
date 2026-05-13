const Badge = ({ status }) => {
  const map = {
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    active: 'badge-success',
    inactive: 'badge-danger',
    credit: 'badge-success',
    debit: 'badge-danger',
    completed: 'badge-success',
    failed: 'badge-danger',
    joining_bonus: 'badge-info',
    referral_bonus: 'badge-info',
    level_income: 'badge-info',
    admin_adjustment: 'badge-warning',
    withdrawal: 'badge-danger',
    withdrawal_reject: 'badge-warning',
  };
  return <span className={map[status] || 'badge-info'}>{status?.replace(/_/g, ' ')}</span>;
};

export default Badge;
