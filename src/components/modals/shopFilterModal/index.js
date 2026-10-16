import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {CustomButton, StyledText} from '../../atoms';
import {CheckIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {formatCurrency} from '../../../utils/invoice';
import {productCategories} from '../../../utils/shop';
import PriceRangeSlider from './PriceRangeSlider';
import styles from './styles';

export const DEFAULT_SHOP_FILTERS = {
  minPrice: 0,
  maxPrice: 10000,
  categories: [],
};

export {productCategories as DEFAULT_SHOP_CATEGORIES};

const ShopFilterModal = ({
  isVisible = false,
  filters = DEFAULT_SHOP_FILTERS,
  categories = productCategories,
  minPrice = 0,
  maxPrice = 10000,
  onClose,
  onApply,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [draftFilters, setDraftFilters] = useState(DEFAULT_SHOP_FILTERS);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    setDraftFilters({
      minPrice: Number(filters?.minPrice) || minPrice,
      maxPrice: Number(filters?.maxPrice) || maxPrice,
      categories: Array.isArray(filters?.categories)
        ? [...filters.categories]
        : [],
    });
  }, [filters, isVisible, maxPrice, minPrice]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handlePriceChange = useCallback((low, high) => {
    setDraftFilters(current => ({
      ...current,
      minPrice: low,
      maxPrice: high,
    }));
  }, []);

  const handleToggleCategory = useCallback(categoryValue => {
    setDraftFilters(current => {
      const isSelected = current.categories.includes(categoryValue);
      return {
        ...current,
        categories: isSelected
          ? current.categories.filter(item => item !== categoryValue)
          : [...current.categories, categoryValue],
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    const clearedFilters = {
      minPrice,
      maxPrice,
      categories: [],
    };
    setDraftFilters(clearedFilters);
    onApply?.(clearedFilters);
    onClose?.();
  }, [maxPrice, minPrice, onApply, onClose]);

  const handleApply = useCallback(() => {
    onApply?.({
      minPrice: draftFilters.minPrice,
      maxPrice: draftFilters.maxPrice,
      categories: [...draftFilters.categories],
    });
    onClose?.();
  }, [draftFilters, onApply, onClose]);

  const priceLabel = useMemo(
    () =>
      `${formatCurrency(draftFilters.minPrice)} - ${formatCurrency(
        draftFilters.maxPrice,
      )}`,
    [draftFilters.maxPrice, draftFilters.minPrice],
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      useNativeDriver>
      <View style={[styles.container, {paddingBottom: insets.bottom || 16}]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <StyledText variant="bold" size={22}>
            {t('SHOP.FILTERS_TITLE')}
          </StyledText>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <StyledText
              variant="bold"
              size={16}
              containerStyle={styles.sectionTitle}>
              {t('SHOP.PRICE')}
            </StyledText>
            <PriceRangeSlider
              min={minPrice}
              max={maxPrice}
              lowValue={draftFilters.minPrice}
              highValue={draftFilters.maxPrice}
              onValuesChange={handlePriceChange}
              activeColor={COLORS.PRIMARY}
            />
            <StyledText
              color={COLORS.TEXT_SECONDARY}
              size={14}
              containerStyle={styles.priceRangeText}>
              {priceLabel}
            </StyledText>
          </View>

          <View style={styles.section}>
            <StyledText
              variant="bold"
              size={16}
              containerStyle={styles.sectionTitle}>
              {t('SHOP.CATEGORIES')}
            </StyledText>
            {categories.map(category => {
              const checked = draftFilters.categories.includes(category.value);

              return (
                <Pressable
                  key={category.value}
                  accessibilityRole="checkbox"
                  accessibilityState={{checked}}
                  onPress={() => handleToggleCategory(category.value)}
                  style={styles.categoryRow}>
                  <View
                    style={[
                      styles.checkbox,
                      checked && styles.checkboxSelected,
                    ]}>
                    {checked ? (
                      <CheckIcon color={COLORS.LOGIN_PRIMARY} size={12} />
                    ) : null}
                  </View>
                  <StyledText size={15}>{category.label}</StyledText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title={t('SHOP.CLEAR')}
            onPress={handleClear}
            color={COLORS.WHITE}
            textColor={COLORS.TEXT}
            containerStyle={styles.clearButton}
          />
          <CustomButton
            title={t('SHOP.APPLY')}
            onPress={handleApply}
            color={COLORS.LOGIN_PRIMARY}
            containerStyle={styles.applyButton}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ShopFilterModal;
