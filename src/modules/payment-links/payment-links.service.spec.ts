import { ForbiddenException } from '@nestjs/common';
import { PaymentLinksService } from './payment-links.service';

describe('PaymentLinksService merchant suspension', () => {
  it('blocks redemption for a suspended link owner', async () => {
    const link = {
      id: 'link-id',
      token: 'token',
      merchantId: 'merchant-id',
      isActive: true,
      expiresAt: null,
      views: 0,
    };
    const repo = {
      findOneBy: jest.fn().mockResolvedValue(link),
      increment: jest.fn().mockResolvedValue(undefined),
    };
    const usersService = {
      assertMerchantActive: jest
        .fn()
        .mockRejectedValue(new ForbiddenException('Merchant is suspended')),
    };
    const service = new PaymentLinksService(
      repo as any,
      {} as any,
      { child: () => ({}) } as any,
      usersService as any,
    );

    await expect(service.redeemLink('token', {} as any)).rejects.toThrow(
      ForbiddenException,
    );
    expect(usersService.assertMerchantActive).toHaveBeenCalledWith('merchant-id');
  });
});
