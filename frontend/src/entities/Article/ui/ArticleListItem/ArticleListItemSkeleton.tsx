import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Card } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ArticleView } from '../../model/types/article';
import cls from './ArticleListItem.module.scss';
import skeletonCls from './ArticleListItemSkeleton.module.scss';

interface ArticleListItemSkeletonProps {
    className?: string;
    view: ArticleView;
}

export const ArticleListItemSkeleton = memo((props: ArticleListItemSkeletonProps) => {
    const { className, view } = props;

    if (view === ArticleView.BIG) {
        return (
            <div className={classNames(cls.ArticleListItem, {}, [className, cls[view]])}>
                <Card className={skeletonCls.card}>
                    <div className={skeletonCls.header}>
                        <Skeleton border="50%" height={30} width={30} className={skeletonCls.avatar} />
                        <Skeleton width={150} height={16} />
                    </div>
                    <Skeleton width={250} height={24} className={skeletonCls.title} />
                    <Skeleton height={200} className={skeletonCls.img} />
                    <div className={skeletonCls.footer}>
                        <Skeleton height={36} width={200} />
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className={classNames(cls.ArticleListItem, {}, [className, cls[view]])}>
            <Card className={skeletonCls.card}>
                <Skeleton width={200} height={200} className={skeletonCls.img} />
                <div className={skeletonCls.footer}>
                    <Skeleton height={16} width={130} />
                    <Skeleton height={16} width={50} />
                </div>
                <Skeleton width={150} height={16} className={skeletonCls.title} />
            </Card>
        </div>
    );
});

