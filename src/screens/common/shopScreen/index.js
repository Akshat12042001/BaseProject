import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Skeleton from 'react-native-reanimated-skeleton';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {
  DEFAULT_SHOP_FILTERS,
  ShopFilterModal,
} from '../../../components/modals';
import {ScreenHeader, ShopProductCard} from '../../../components/molecules';
import {BagIcon, CartIcon, FilterIcon} from '../../../components/svgs';
import {makeGetHostProductCatalogRequest} from '../../../api/common';
import {COLORS, NAVIGATION, SCREEN} from '../../../constants';
import {
  buildShopCatalogParams,
  getShopCatalogMeta,
  getShopCatalogProducts,
  mapShopProduct,
  SHOP_PAGE_LIMIT,
} from '../../../utils/shop';
import styles from './styles';

const PRODUCT_CARD_HEIGHT = 320;

const PRODUCTS_SKELETON_LAYOUT = Array.from({length: 3}, (_, index) => ({
  key: `product-skeleton-${index}`,
  width: SCREEN.WIDTH - 32,
  height: PRODUCT_CARD_HEIGHT,
  borderRadius: 16,
  marginBottom: 12,
}));

const hasActiveFilters = filters => {
  const categories = Array.isArray(filters?.categories)
    ? filters.categories
    : [];

  return (
    Number(filters?.minPrice) !== DEFAULT_SHOP_FILTERS.minPrice ||
    Number(filters?.maxPrice) !== DEFAULT_SHOP_FILTERS.maxPrice ||
    categories.length > 0
  );
};

const keyExtractor = item => item.id;

const ShopScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const requestIdRef = useRef(0);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_SHOP_FILTERS);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  // Placeholder until cart API is wired.
  const [cartItemCount] = useState(0);

  const isFilterApplied = useMemo(() => hasActiveFilters(filters), [filters]);
  const hasNextPage = page < totalPages;
  const cartBadgeLabel = useMemo(() => {
    if (cartItemCount <= 0) {
      return '';
    }
    return cartItemCount > 99 ? '99+' : String(cartItemCount);
  }, [cartItemCount]);

  const fetchProducts = useCallback(
    async ({
      page: nextPage = 1,
      nextFilters = filters,
      append = false,
      refreshing = false,
    } = {}) => {
      const requestId = ++requestIdRef.current;

      try {
        if (refreshing) {
          setIsRefreshing(true);
        } else if (append) {
          setIsFetchingMore(true);
        } else {
          setIsLoading(true);
        }

        const response = await makeGetHostProductCatalogRequest(
          buildShopCatalogParams({
            page: nextPage,
            limit: SHOP_PAGE_LIMIT,
            minPrice: nextFilters.minPrice,
            maxPrice: nextFilters.maxPrice,
            categories: nextFilters.categories,
          }),
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        const mappedProducts = getShopCatalogProducts(response).map(
          mapShopProduct,
        );
        const meta = getShopCatalogMeta(response);

        setProducts(current =>
          append ? [...current, ...mappedProducts] : mappedProducts,
        );
        setPage(meta.page);
        setTotalPages(meta.totalPages);
        setIsError(false);
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        if (!append) {
          setProducts([]);
          setPage(1);
          setTotalPages(1);
        }
        setIsError(true);
      } finally {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setIsLoading(false);
        setIsFetchingMore(false);
        setIsRefreshing(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    fetchProducts({page: 1, nextFilters: filters, append: false});
  }, [fetchProducts, filters, isFocused]);

  const handleOpenFilter = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  const handleOpenCheckout = useCallback(() => {
    // Placeholder until checkout screen is wired.
  }, []);

  const handleOpenOrders = useCallback(() => {
    navigation.navigate(NAVIGATION.COMMON.ORDERS_SCREEN);
  }, []);

  const handleApplyFilters = useCallback(nextFilters => {
    setPage(1);
    setFilters(nextFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchProducts({
      page: 1,
      nextFilters: filters,
      append: false,
      refreshing: true,
    });
  }, [fetchProducts, filters]);

  const handleLoadMore = useCallback(() => {
    if (isLoading || isFetchingMore || isRefreshing || !hasNextPage) {
      return;
    }

    fetchProducts({
      page: page + 1,
      nextFilters: filters,
      append: true,
    });
  }, [
    fetchProducts,
    filters,
    hasNextPage,
    isFetchingMore,
    isLoading,
    isRefreshing,
    page,
  ]);

  const renderProduct = useCallback(
    ({item}) => (
      <ShopProductCard
        title={item.title}
        description={item.description}
        category={item.category}
        imageUrl={item.imageUrl}
        price={item.price}
        originalPrice={item.originalPrice}
        discountPercent={item.discountPercent}
        exclGst={item.exclGst}
      />
    ),
    [],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.listSeparator} />,
    [],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
      </View>
    );
  }, [isFetchingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
          {isError ? t('SHOP.LOAD_ERROR') : t('SHOP.EMPTY')}
        </StyledText>
      </View>
    );
  }, [isError, isLoading, t]);

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t('SHOP.TITLE')}
        subtitle={t('SHOP.SUBTITLE')}
        onBack={() => navigation.goBack()}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('SHOP.CHECKOUT')}
              onPress={handleOpenCheckout}
              style={styles.headerIconButton}>
              <CartIcon color={COLORS.SURFACE} size={18} />
              {!!cartBadgeLabel && (
                <View style={styles.cartBadge}>
                  <StyledText
                    color={COLORS.WHITE}
                    size={9}
                    variant="bold"
                    textStyle={styles.cartBadgeText}>
                    {cartBadgeLabel}
                  </StyledText>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('SHOP.ORDERS')}
              onPress={handleOpenOrders}
              style={styles.headerIconButton}>
              <BagIcon color={COLORS.SURFACE} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('SHOP.FILTER')}
              onPress={handleOpenFilter}
              style={styles.headerIconButton}>
              <FilterIcon color={COLORS.SURFACE} size={18} />
              {isFilterApplied ? <View style={styles.filterDot} /> : null}
            </TouchableOpacity>
          </View>
        }
      />

      {isLoading && !isRefreshing ? (
        <Skeleton
          isLoading
          layout={PRODUCTS_SKELETON_LAYOUT}
          boneColor={COLORS.SKELETON_BONE}
          highlightColor={COLORS.SKELETON_HIGHLIGHT}
          containerStyle={styles.skeletonContainer}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderProduct}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.LOGIN_PRIMARY}
              colors={[COLORS.LOGIN_PRIMARY]}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            !products.length && styles.emptyList,
          ]}
        />
      )}

      <ShopFilterModal
        isVisible={isFilterVisible}
        filters={filters}
        onClose={handleCloseFilter}
        onApply={handleApplyFilters}
      />
    </ScreenContainer>
  );
};

export default ShopScreen;
