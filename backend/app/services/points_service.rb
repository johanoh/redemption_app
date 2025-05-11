class PointsService
  def initialize(user:, amount: nil, reward: nil)
    @user = user
    @amount = amount
    @reward = reward
    @redeem_success = nil
    @redemption = nil
  end

  def set_user_points!
    raise ArgumentError, "amount must be provided" if amount.nil?
    raise ArgumentError, "Amount must be positive" if amount.negative?

    user.with_lock do
      change_user_balance(to: amount)
    end
  end

  def redeem!
    return @redeem_success unless @redeem_success.nil?

    raise ArgumentError, "reward must be provided" if reward.nil?

    @redeem_success = user.with_lock do
      ActiveRecord::Base.transaction do
        raise StandardError, "Insufficient points" if user.points_balance < reward.points_cost

        change_user_balance(by: -reward.points_cost)
        @redemption = create_redemption!
        true
      end
    end

  rescue
    @redeem_success = false
  end

  attr_reader :user, :amount, :reward, :redemption

  private


  def change_user_balance(to: nil, by: nil)
    if to
      user.update!(points_balance: to)
    elsif by
      user.update!(points_balance: user.points_balance + by)
    else
      raise ArgumentError, "Must provide either `to:` or `by:`"
    end
  end

  def create_redemption!
    Redemption.create!(
      user: user,
      reward: reward,
      redeemed_at: Time.current
    )
  end
end
