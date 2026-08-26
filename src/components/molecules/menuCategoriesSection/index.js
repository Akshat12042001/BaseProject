import React, {useCallback, useRef} from 'react';
import {Switch, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Input, StyledText} from '../../atoms';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  PlusIcon,
  TrashIcon,
} from '../../svgs';
import {COLORS} from '../../../constants';
import styles from './styles';

const SUGGESTED_CATEGORY_KEYS = [
  'BREAKFAST',
  'SNACKS',
  'LUNCH',
  'MAIN_COURSE',
  'DINNER',
  'DRINKS',
  'DESSERT',
];

const sanitizeDecimal = value => {
  const sanitizedValue = value.replace(/[^0-9.]/g, '');
  const [wholeNumber, ...decimalParts] = sanitizedValue.split('.');
  return decimalParts.length
    ? `${wholeNumber}.${decimalParts.join('')}`
    : wholeNumber;
};

export const createMenuItem = id => ({
  id: String(id),
  name: '',
  price: '',
  isNonVeg: false,
  isMustHave: false,
});

export const createMenuCategory = (id, name = '') => ({
  id: String(id),
  name,
  items: [createMenuItem(1)],
});

const CurrencyIcon = () => (
  <StyledText color={COLORS.TEXT_SECONDARY} size={14}>
    ₹
  </StyledText>
);

const MenuCategoriesSection = ({categories, onCategoriesChange}) => {
  const {t} = useTranslation();
  const nextCategoryId = useRef(categories.length + 1);
  const nextItemIds = useRef({});

  const updateCategories = useCallback(
    updater => {
      onCategoriesChange(currentCategories => updater(currentCategories));
    },
    [onCategoriesChange],
  );

  const getNextItemId = useCallback(categoryId => {
    const currentCount = nextItemIds.current[categoryId] || 2;
    nextItemIds.current[categoryId] = currentCount + 1;
    return currentCount;
  }, []);

  const handleCategoryNameChange = useCallback(
    (categoryId, name) => {
      updateCategories(currentCategories =>
        currentCategories.map(category =>
          category.id === categoryId ? {...category, name} : category,
        ),
      );
    },
    [updateCategories],
  );

  const handleSuggestedCategoryPress = useCallback(
    (categoryId, label) => {
      handleCategoryNameChange(categoryId, label);
    },
    [handleCategoryNameChange],
  );

  const handleMoveCategory = useCallback(
    (categoryId, direction) => {
      updateCategories(currentCategories => {
        const index = currentCategories.findIndex(
          category => category.id === categoryId,
        );

        if (index < 0) {
          return currentCategories;
        }

        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= currentCategories.length) {
          return currentCategories;
        }

        const nextCategories = [...currentCategories];
        [nextCategories[index], nextCategories[targetIndex]] = [
          nextCategories[targetIndex],
          nextCategories[index],
        ];

        return nextCategories;
      });
    },
    [updateCategories],
  );

  const handleRemoveCategory = useCallback(
    categoryId => {
      updateCategories(currentCategories =>
        currentCategories.filter(category => category.id !== categoryId),
      );
    },
    [updateCategories],
  );

  const handleAddCategory = useCallback(() => {
    const categoryId = nextCategoryId.current;
    nextCategoryId.current += 1;
    updateCategories(currentCategories => [
      ...currentCategories,
      createMenuCategory(categoryId),
    ]);
  }, [updateCategories]);

  const handleItemChange = useCallback(
    (categoryId, itemId, field, value) => {
      updateCategories(currentCategories =>
        currentCategories.map(category => {
          if (category.id !== categoryId) {
            return category;
          }

          return {
            ...category,
            items: category.items.map(item =>
              item.id === itemId ? {...item, [field]: value} : item,
            ),
          };
        }),
      );
    },
    [updateCategories],
  );

  const handleAddItem = useCallback(
    categoryId => {
      updateCategories(currentCategories =>
        currentCategories.map(category => {
          if (category.id !== categoryId) {
            return category;
          }

          const itemId = getNextItemId(categoryId);
          return {
            ...category,
            items: [...category.items, createMenuItem(itemId)],
          };
        }),
      );
    },
    [getNextItemId, updateCategories],
  );

  const handleDuplicateItem = useCallback(
    (categoryId, itemId) => {
      updateCategories(currentCategories =>
        currentCategories.map(category => {
          if (category.id !== categoryId) {
            return category;
          }

          const sourceItem = category.items.find(item => item.id === itemId);

          if (!sourceItem) {
            return category;
          }

          const newItemId = getNextItemId(categoryId);
          return {
            ...category,
            items: [
              ...category.items,
              {
                ...sourceItem,
                id: String(newItemId),
              },
            ],
          };
        }),
      );
    },
    [getNextItemId, updateCategories],
  );

  const handleRemoveItem = useCallback(
    (categoryId, itemId) => {
      updateCategories(currentCategories =>
        currentCategories.map(category => {
          if (category.id !== categoryId) {
            return category;
          }

          const nextItems = category.items.filter(item => item.id !== itemId);
          return {
            ...category,
            items: nextItems.length ? nextItems : [createMenuItem(getNextItemId(categoryId))],
          };
        }),
      );
    },
    [getNextItemId, updateCategories],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText variant="bold" size={15}>
          {t('CREATE_MENU.CATEGORIES_TITLE')}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={11}
          containerStyle={styles.subtitle}>
          {t('CREATE_MENU.CATEGORIES_SUBTITLE')}
        </StyledText>
      </View>

      {categories.map((category, categoryIndex) => (
        <View key={category.id} style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <Input
              label={t('CREATE_MENU.CATEGORY_NAME')}
              value={category.name}
              onChangeText={value => handleCategoryNameChange(category.id, value)}
              containerStyles={styles.categoryInput}
              borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
              focusedBorderColor={COLORS.LOGIN_PRIMARY}
            />
            <View style={styles.categoryActions}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('CREATE_MENU.MOVE_CATEGORY_UP')}
                disabled={categoryIndex === 0}
                onPress={() => handleMoveCategory(category.id, 'up')}
                style={styles.iconButton}>
                <ChevronUpIcon
                  color={
                    categoryIndex === 0 ? COLORS.BORDER : COLORS.TEXT_MUTED
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('CREATE_MENU.MOVE_CATEGORY_DOWN')}
                disabled={categoryIndex === categories.length - 1}
                onPress={() => handleMoveCategory(category.id, 'down')}
                style={styles.iconButton}>
                <ChevronDownIcon
                  color={
                    categoryIndex === categories.length - 1
                      ? COLORS.BORDER
                      : COLORS.TEXT_MUTED
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('CREATE_MENU.REMOVE_CATEGORY')}
                onPress={() => handleRemoveCategory(category.id)}
                style={styles.iconButton}>
                <TrashIcon size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.suggestedSection}>
            <StyledText
              color={COLORS.TEXT_SECONDARY}
              size={11}
              containerStyle={styles.suggestedLabel}>
              {t('CREATE_MENU.SUGGESTED_CATEGORIES')}
            </StyledText>
            <View style={styles.suggestedList}>
              {SUGGESTED_CATEGORY_KEYS.map(key => (
                <TouchableOpacity
                  key={key}
                  accessibilityRole="button"
                  onPress={() =>
                    handleSuggestedCategoryPress(
                      category.id,
                      t(`CREATE_MENU.SUGGESTED.${key}`),
                    )
                  }
                  style={styles.suggestedChip}>
                  <StyledText size={11}>
                    {t(`CREATE_MENU.SUGGESTED.${key}`)}
                  </StyledText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {category.items.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemFieldsRow}>
                <Input
                  label={t('CREATE_MENU.ITEM_NAME')}
                  value={item.name}
                  onChangeText={value =>
                    handleItemChange(category.id, item.id, 'name', value)
                  }
                  containerStyles={styles.itemNameField}
                  borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                  focusedBorderColor={COLORS.LOGIN_PRIMARY}
                />
                <Input
                  label={t('CREATE_MENU.ITEM_PRICE')}
                  value={item.price}
                  onChangeText={value =>
                    handleItemChange(
                      category.id,
                      item.id,
                      'price',
                      sanitizeDecimal(value),
                    )
                  }
                  keyboardType="decimal-pad"
                  leftIcon={<CurrencyIcon />}
                  containerStyles={styles.priceField}
                  borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                  focusedBorderColor={COLORS.LOGIN_PRIMARY}
                />
              </View>

              <View style={styles.itemMetaRow}>
                <View style={styles.toggleGroup}>
                  <View style={styles.toggleRow}>
                    <Switch
                      value={item.isNonVeg}
                      onValueChange={value =>
                        handleItemChange(category.id, item.id, 'isNonVeg', value)
                      }
                      trackColor={{
                        false: COLORS.BORDER_LIGHT,
                        true: COLORS.LOGIN_PRIMARY,
                      }}
                      thumbColor={COLORS.SURFACE}
                    />
                    <StyledText size={11}>{t('CREATE_MENU.NON_VEG')}</StyledText>
                  </View>
                  <View style={styles.toggleRow}>
                    <Switch
                      value={item.isMustHave}
                      onValueChange={value =>
                        handleItemChange(
                          category.id,
                          item.id,
                          'isMustHave',
                          value,
                        )
                      }
                      trackColor={{
                        false: COLORS.BORDER_LIGHT,
                        true: COLORS.LOGIN_PRIMARY,
                      }}
                      thumbColor={COLORS.SURFACE}
                    />
                    <StyledText size={11}>{t('CREATE_MENU.MUST_HAVE')}</StyledText>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('CREATE_MENU.DUPLICATE_ITEM')}
                    onPress={() => handleDuplicateItem(category.id, item.id)}
                    style={styles.iconButton}>
                    <CopyIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('CREATE_MENU.REMOVE_ITEM')}
                    onPress={() => handleRemoveItem(category.id, item.id)}
                    style={styles.iconButton}>
                    <TrashIcon color={COLORS.TEXT_MUTED} size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => handleAddItem(category.id)}
            style={styles.outlineButton}>
            <PlusIcon color={COLORS.LOGIN_PRIMARY} size={16} />
            <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={12}>
              {t('CREATE_MENU.ADD_ITEM')}
            </StyledText>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        accessibilityRole="button"
        onPress={handleAddCategory}
        style={[styles.outlineButton, styles.addCategoryButton]}>
        <PlusIcon color={COLORS.LOGIN_PRIMARY} size={16} />
        <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={12}>
          {t('CREATE_MENU.ADD_CATEGORY')}
        </StyledText>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(MenuCategoriesSection);
