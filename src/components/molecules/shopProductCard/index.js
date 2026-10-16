import React, {useMemo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import {formatCurrency} from '../../../utils/invoice';
import styles from './styles';

const ShopProductCard = ({
  title,
  description,
  category,
  imageUrl,
  price,
  originalPrice,
  discountPercent,
  exclGst = true,
  onPress,
}) => {
  const {t} = useTranslation();

  const showDiscount = Number(discountPercent) > 0;
  const showOriginalPrice =
    Number(originalPrice) > 0 && Number(originalPrice) !== Number(price);

  const discountLabel = useMemo(() => {
    const value = Math.round(Number(discountPercent) || 0);
    return t('SHOP.DISCOUNT_OFF', {percent: value});
  }, [discountPercent, t]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={!onPress}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.imageWrap}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <StyledText color={COLORS.TEXT_MUTED} size={12}>
              {t('SHOP.PRODUCT_PHOTO')}
            </StyledText>
          </View>
        )}
        {showDiscount ? (
          <View style={styles.discountBadge}>
            <StyledText color={COLORS.WHITE} size={11} variant="bold">
              {discountLabel}
            </StyledText>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        {!!category && (
          <View style={styles.categoryTag}>
            <StyledText color={COLORS.LOGIN_PRIMARY} size={11} variant="medium">
              {category}
            </StyledText>
          </View>
        )}

        <StyledText
          variant="bold"
          size={15}
          numberOfLines={1}
          containerStyle={styles.title}>
          {title}
        </StyledText>

        {!!description && (
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={12}
            numberOfLines={2}
            containerStyle={styles.description}>
            {description}
          </StyledText>
        )}

        <View style={styles.priceRow}>
          <StyledText
            color={COLORS.LOGIN_PRIMARY}
            size={16}
            variant="bold"
            containerStyle={styles.currentPrice}>
            {formatCurrency(price)}
          </StyledText>
          {showOriginalPrice ? (
            <StyledText
              color={COLORS.TEXT_MUTED}
              size={13}
              containerStyle={styles.originalPrice}>
              {formatCurrency(originalPrice)}
            </StyledText>
          ) : null}
          {exclGst ? (
            <StyledText
              color={COLORS.TEXT_MUTED}
              size={11}
              textStyle={styles.taxNote}>
              {t('SHOP.EXCL_GST')}
            </StyledText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ShopProductCard);
